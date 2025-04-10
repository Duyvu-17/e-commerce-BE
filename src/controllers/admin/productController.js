import Product from "../../models/Product.js";
import ProductItem from "../../models/ProductItem.js";
import ProductImage from "../../models/ProductImage.js";
import Inventory from "../../models/Inventory.js";
import Category from "../../models/Category.js";
import Discount from "../../models/Discount.js";
import DiscountProduct from "../../models/DiscountProduct.js";

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "name", "description", "image" ,"price", "createdAt", "updatedAt"],
      include: [
        {
          model: ProductItem,
          attributes: ["id", "sku", "price"],
          include: [
            {
              model: Inventory,
              attributes: ["quantity"],  
            },
          ],
        },
        {
          model: Category,
          as: 'category',
          attributes: ["id", "name"],
        },
        {
          model: Discount,
          through: DiscountProduct,
          attributes: ["id", "code", "discount_type", "discount_value", "start_date", "end_date"],
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    // Format lại dữ liệu để thêm số lượng tồn kho và số lượng biến thể vào mỗi sản phẩm
    const formattedProducts = products.map(product => {
      const productData = product.toJSON();

      // Tính tổng số lượng tồn kho từ tất cả các ProductItem
      let inventory = 0;
      if (productData.ProductItems) {
        productData.ProductItems.forEach(item => {
          // Kiểm tra xem có thông tin tồn kho không
          if (item.Inventory && item.Inventory.quantity) {
            inventory += item.Inventory.quantity; // Cộng dồn số lượng tồn kho
          }
        });
      }

      // Thêm số lượng tồn kho vào dữ liệu sản phẩm
      productData.inventory = inventory;

      // Tính giá sau khi áp dụng giảm giá
      const originalPrice = parseFloat(productData.price);
      let salePrice = null; // Khởi tạo salePrice là null nếu không có giảm giá

      // Kiểm tra xem sản phẩm có mã giảm giá hợp lệ không
      const currentDate = new Date();
      const activeDiscounts = productData.Discounts?.filter(discount => 
        new Date(discount.start_date) <= currentDate && 
        new Date(discount.end_date) >= currentDate
      ) || [];

      if (activeDiscounts.length > 0) {
        // Áp dụng mã giảm giá đầu tiên tìm thấy (hoặc có thể áp dụng mã giảm giá có giá trị cao nhất)
        const discount = activeDiscounts[0];
        const discountValue = parseFloat(discount.discount_value);
        
        if (discount.discount_type === 'percentage') {
          // Giảm giá theo phần trăm
          salePrice = originalPrice - (originalPrice * (discountValue / 100));
        } else if (discount.discount_type === 'fixed') {
          // Giảm giá cố định
          salePrice = Math.max(0, originalPrice - discountValue);
        }
        
        // Làm tròn giá đến 2 chữ số thập phân
        salePrice = Math.round(salePrice * 100) / 100;
      }

      // Thêm giá sau khi giảm vào dữ liệu sản phẩm
      productData.salePrice = salePrice;

      return productData;
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách sản phẩm" });
  }
};


const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      attributes: [
        "id",
        "name",
        "description",
        "summary",
        "slug",
        "image",
        "status",
        "price",
        "sku",
        "barcode",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: ProductItem,
          attributes: [
            "id",
            "sku",
            "price",
            "weight",
            "dimensions",
            "attributes",
            "status",
            "color",
            "size",
            "name",
            "barcode",
          ],
          include: [
            {
              model: ProductImage,
              attributes: ["id", "image_url", "is_primary"],
            },
          ],
        },
        {
          model: ProductImage,
          attributes: ["id", "image_url", "is_primary"],
          where: { product_item_id: null },
          required: false,
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Discount,
          through: DiscountProduct,
          attributes: [
            "id",
            "code",
            "discount_type",
            "discount_value",
            "start_date",
            "end_date",
          ],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy sản phẩm" 
      });
    }

    // Format lại dữ liệu
    const productData = product.toJSON();
    
    // Tìm ảnh cover chính
    const primaryImage = product.ProductImages?.find(img => img.is_primary) || product.ProductImages?.[0];
    if (primaryImage && !productData.image) {
      productData.image = primaryImage.image_url;
    }
    
    // Thêm thông tin giá
    if (productData.ProductItems && productData.ProductItems.length > 0) {
      const prices = productData.ProductItems.map(item => parseFloat(item.price));
      productData.min_price = Math.min(...prices);
      productData.max_price = Math.max(...prices);
    }

    // Tính giá sau khi áp dụng giảm giá
    const originalPrice = parseFloat(productData.price);
    let salePrice = originalPrice;

    // Kiểm tra xem sản phẩm có mã giảm giá hợp lệ không
    const currentDate = new Date();
    const activeDiscounts = productData.Discounts?.filter(discount => 
      new Date(discount.start_date) <= currentDate && 
      new Date(discount.end_date) >= currentDate
    ) || [];

    if (activeDiscounts.length > 0) {
      // Áp dụng mã giảm giá đầu tiên tìm thấy (hoặc có thể áp dụng mã giảm giá có giá trị cao nhất)
      const discount = activeDiscounts[0];
      const discountValue = parseFloat(discount.discount_value);
      
      if (discount.discount_type === 'percentage') {
        // Giảm giá theo phần trăm
        salePrice = originalPrice - (originalPrice * (discountValue / 100));
      } else if (discount.discount_type === 'fixed') {
        // Giảm giá cố định
        salePrice = Math.max(0, originalPrice - discountValue);
      }
      
      // Làm tròn giá đến 2 chữ số thập phân
      salePrice = Math.round(salePrice * 100) / 100;
    }

    // Thêm giá sau khi giảm vào dữ liệu sản phẩm
    productData.salePrice = salePrice;

    res.status(200).json({
      success: true,
      data: productData
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi lấy thông tin sản phẩm" 
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, summary, slug, image, status, category_id, product_items } = req.body;

    const newProduct = await Product.create({ 
      name, 
      description, 
      summary, 
      slug, 
      image, 
      status, 
      category_id 
    });

    if (product_items?.length) {
      await Promise.all(
        product_items.map(async (item) =>
          ProductItem.create({
            product_id: newProduct.id,
            sku: item.sku,
            price: item.price,
         
            weight: item.weight,
            dimensions: item.dimensions,
            attributes: item.attributes,
            status: item.status,
            color: item.color,
            size: item.size
          })
        )
      );
    }

    res.status(201).json({ 
      success: true,
      message: "Thêm sản phẩm thành công", 
      data: newProduct 
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi thêm sản phẩm" 
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, summary, slug, image, status, category_id } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy sản phẩm" 
      });
    }

    await product.update({ 
      name, 
      description, 
      summary, 
      slug, 
      image, 
      status, 
      category_id 
    });
    
    res.status(200).json({ 
      success: true,
      message: "Cập nhật sản phẩm thành công", 
      data: product 
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi cập nhật sản phẩm" 
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy sản phẩm" 
      });
    }

    // Soft delete - chỉ cập nhật trạng thái
    await product.update({ status: 'deleted' });
    
    res.status(200).json({ 
      success: true,
      message: "Xóa sản phẩm thành công" 
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi xóa sản phẩm" 
    });
  }
};

const productController = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productController;