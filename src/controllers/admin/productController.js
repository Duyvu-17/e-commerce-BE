import Product from "../../models/Product.js";
import ProductItem from "../../models/ProductItem.js";
import ProductImage from "../../models/ProductImage.js";
import Inventory from "../../models/Inventory.js";
import Category from "../../models/Category.js";
import Discount from "../../models/Discount.js";
import DiscountProduct from "../../models/DiscountProduct.js";
import Settings from "../../models/Settings.js";

const getProducts = async (req, res) => {
  try {
    // Lấy threshold từ Settings
    const [lowStockSetting, outOfStockSetting] = await Promise.all([
      Settings.findOne({ where: { setting_key: "low_stock_threshold" } }),
      Settings.findOne({ where: { setting_key: "out_of_stock_threshold" } }),
    ]);

    const lowThreshold = parseInt(lowStockSetting?.setting_value || "20");
    const outThreshold = parseInt(outOfStockSetting?.setting_value || "5");

    const products = await Product.findAll({
      attributes: ["id", "name", "description", "image", "price", "category_id", "isDeleted", "isActive", "status", "createdAt", "updatedAt"],
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
          model: Discount,
          through: DiscountProduct,
          attributes: ["id", "code", "discount_type", "discount_value", "start_date", "end_date"],
        }
      ],
    });

    const formattedProducts = await Promise.all(products.map(async (product) => {
      const productData = product.toJSON();

      let inventory = 0;
      if (productData.ProductItems) {
        productData.ProductItems.forEach(item => {
          if (item.Inventory?.quantity) {
            inventory += item.Inventory.quantity;
          }
        });
      }

      productData.inventory = inventory;

      // 👇 Tính status mong muốn
      let expectedStatus = "in stock";
      if (inventory <= outThreshold) {
        expectedStatus = "out of stock";
      } else if (inventory <= lowThreshold) {
        expectedStatus = "low stock";
      }
      

      // 👇 Nếu khác status hiện tại, cập nhật lại
      if (product.status !== expectedStatus) {
        await Product.update(
          { status: expectedStatus },
          { where: { id: product.id } }
        );
        productData.status = expectedStatus; // cập nhật trong kết quả trả ra luôn
      }

      // Tính giá sau khi áp dụng giảm giá
      const originalPrice = parseFloat(productData.price);
      let salePrice = null;

      const currentDate = new Date();
      const activeDiscounts = productData.Discounts?.filter(discount =>
        new Date(discount.start_date) <= currentDate &&
        new Date(discount.end_date) >= currentDate
      ) || [];

      if (activeDiscounts.length > 0) {
        const discount = activeDiscounts[0];
        const discountValue = parseFloat(discount.discount_value);
        if (discount.discount_type === 'percentage') {
          salePrice = originalPrice - (originalPrice * (discountValue / 100));
        } else if (discount.discount_type === 'fixed') {
          salePrice = Math.max(0, originalPrice - discountValue);
        }
        salePrice = Math.round(salePrice * 100) / 100;
      }

      productData.salePrice = salePrice;

      return productData;
    }));

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
        "isDeleted",
        "isActive",
        "price",
        "status",
        "category_id",
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
            {
              model: Inventory,
              attributes: ["quantity"],
            },
          ],
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

    const productData = product.toJSON();

    // Tính tổng tồn kho
    let inventory = 0;
    productData.ProductItems?.forEach(item => {
      if (item.Inventory && item.Inventory.quantity) {
        inventory += item.Inventory.quantity;
      }
    });
    productData.inventory = inventory;

    // Cập nhật lại status nếu cần
    const shouldBeStatus = inventory > 0 ? 'in stock' : 'out of stock';
    if (product.status !== shouldBeStatus) {
      await product.update({ status: shouldBeStatus });
      productData.status = shouldBeStatus;
    }

    // Tìm ảnh chính nếu chưa có image
    const primaryImage = product.ProductImages?.find(img => img.is_primary) || product.ProductImages?.[0];
    if (primaryImage && !productData.image) {
      productData.image = primaryImage.image_url;
    }

    // Thêm min/max price
    if (productData.ProductItems && productData.ProductItems.length > 0) {
      const prices = productData.ProductItems.map(item => parseFloat(item.price));
      productData.min_price = Math.min(...prices);
      productData.max_price = Math.max(...prices);
    }

    // Tính salePrice nếu có giảm giá
    const originalPrice = parseFloat(productData.price);
    let salePrice = originalPrice;

    const currentDate = new Date();
    const activeDiscounts = productData.Discounts?.filter(discount =>
      new Date(discount.start_date) <= currentDate &&
      new Date(discount.end_date) >= currentDate
    ) || [];

    if (activeDiscounts.length > 0) {
      const discount = activeDiscounts[0];
      const discountValue = parseFloat(discount.discount_value);

      if (discount.discount_type === 'percentage') {
        salePrice = originalPrice - (originalPrice * (discountValue / 100));
      } else if (discount.discount_type === 'fixed') {
        salePrice = Math.max(0, originalPrice - discountValue);
      }

      salePrice = Math.round(salePrice * 100) / 100;
    }

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
    const { name, description, summary, slug, image, status, category_id, isDeleted } = req.body;
    console.log(req.body);

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }

    await product.update({
      name: name || product.name,
      description: description || product.description,
      summary: summary || product.summary,
      slug: slug || product.slug,
      image: image || product.image,
      status: status || product.status,
      category_id: category_id || product.category_id,
      isDeleted: isDeleted ?? product.isDeleted
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

    await product.update({
      isDeleted: true,
      status: 'deleted'
    });

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