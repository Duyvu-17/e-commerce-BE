import Product from "../../models/Product.js";
import ProductItem from "../../models/ProductItem.js";
import ProductImage from "../../models/ProductImage.js";
import Category from "../../models/Category.js";

const productController = {
  // 🛒 Lấy danh sách tất cả sản phẩm
  getAllProducts: async (req, res, next) => {
    try {
      const products = await Product.findAll({
        attributes: ["id", "name", "description"],
        include: [
          {
            model: ProductItem,
            as: "productItems",
            attributes: ["id", "sku", "price", "stock"],
            include: [
              {
                model: ProductImage,
                as: "productsImages",
                attributes: ["imageUrl"],
              },
            ],
          },
          {
            model: Category,
            as: "category",
            attributes: ["name", "image", "status"],
          },
        ],
      });

      if (!products || products.length === 0) {
        return res.status(200).json({
          status: "success",
          message: "Không có sản phẩm nào",
          data: [],
        });
      }

      res.status(200).json({ status: "success", data: products });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      return res.status(500).json({ status: "error", message: "Lỗi hệ thống, vui lòng thử lại sau" });
    }
  },

  // 🔍 Lấy thông tin chi tiết sản phẩm theo ID
  getProductById: async (req, res, next) => {
    try {
      const productId = req.params.id;

      // Kiểm tra ID hợp lệ
      if (!productId || isNaN(productId)) {
        return res.status(400).json({ status: "error", message: "ID sản phẩm không hợp lệ" });
      }

      const product = await Product.findByPk(productId, {
        attributes: ["id", "name", "description"],
        include: [
          {
            model: ProductItem,
            as: "productItems",
            attributes: ["id", "sku", "price", "stock"],
            include: [
              {
                model: ProductImage,
                as: "productsImages",
                attributes: ["imageUrl"],
              },
            ],
          },
          {
            model: Category,
            as: "category",
            attributes: ["name", "image", "status"],
          },
        ],
      });

      if (!product) {
        return res.status(404).json({ status: "error", message: "Sản phẩm không tồn tại" });
      }

      if (product.productItems.length === 0) {
        return res.status(200).json({
          status: "success",
          message: "Sản phẩm này chưa có biến thể",
          data: product,
        });
      }

      res.status(200).json({ status: "success", data: product });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      return res.status(500).json({ status: "error", message: "Lỗi hệ thống, vui lòng thử lại sau" });
    }
  },
};

export default productController;
