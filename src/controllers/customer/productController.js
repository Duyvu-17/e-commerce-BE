import Product from "../../models/Product.js";
import ProductItem from "../../models/ProductItem.js";
import ProductImage from "../../models/ProductImage.js";
import Category from "../../models/Category.js";

const productController = {
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

      res.status(200).json({ status: "success", data: products });
    } catch (error) {
      next(error);
    }
  },

  getProductById: async (req, res, next) => {
    try {
      const product = await Product.findByPk(req.params.id, {
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

      res.status(200).json({ status: "success", data: product });
    } catch (error) {
      next(error);
    }
  },
};

export default productController;
