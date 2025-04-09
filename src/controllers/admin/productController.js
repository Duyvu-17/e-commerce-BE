import Product from "../../models/Product.js";
import ProductItem from "../../models/ProductItem.js";
import ProductImage from "../../models/ProductImage.js";
import Inventory from "../../models/Inventory.js";

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "name", "description", "price", "created_at", "updated_at"],
      include: [
        {
          model: ProductItem,
          attributes: ["id", "sku", "price"],
          include: [
            {
              model: Inventory,
              attributes: ["quantity"],  // Lấy số lượng tồn kho từ bảng Inventory
            },
          ],
        },
        {
          model: Category,
          as: 'category',
          attributes: ["id", "name"],
        },
      ],
      order: [["created_at", "DESC"]],
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

      // Tính số lượng Variants (tương ứng với số lượng ProductItem)
      const variants = productData.ProductItems ? productData.ProductItems.length : 0;

      // Thêm số lượng tồn kho và số lượng biến thể vào dữ liệu sản phẩm
      productData.inventory = inventory;
      productData.variants = variants; 

      return productData;
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách sản phẩm" });
  }
};



// Đừng quên import Op từ Sequelize
import Category from "../../models/Category.js";

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      attributes: [
        'id', 
        'name', 
        'description', 
        'summary', 
        'slug', 
        'cover_image', 
        'status', 
        'category_id', 
        'created_at', 
        'updated_at'
      ],
      include: [
        {
          model: ProductItem,
          attributes: ['id', 'sku', 'price', 'weight', 'dimensions', 'attributes', 'status', 'color', 'size'],
          include: [
            {
              model: ProductImage,
              attributes: ['id', 'image_url', 'is_primary']
            }
          ]
        },
        {
          model: ProductImage,
          attributes: ['id', 'image_url', 'is_primary'],
          where: { product_item_id: null },
          required: false
        }
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
    if (primaryImage && !productData.cover_image) {
      productData.cover_image = primaryImage.image_url;
    }
    
    // Thêm thông tin giá
    if (productData.ProductItems && productData.ProductItems.length > 0) {
      const prices = productData.ProductItems.map(item => Number(item.price));
      productData.min_price = Math.min(...prices);
      productData.max_price = Math.max(...prices);
    }

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
    const { name, description, summary, slug, cover_image, status, category_id, product_items } = req.body;

    const newProduct = await Product.create({ 
      name, 
      description, 
      summary, 
      slug, 
      cover_image, 
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
    const { name, description, summary, slug, cover_image, status, category_id } = req.body;

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
      cover_image, 
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