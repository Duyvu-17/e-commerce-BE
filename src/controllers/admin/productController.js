const Product = require("../../models/Product");
const ProductItem = require("../../models/ProductItem");

// 📌 Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "name", "description", "category_id", "createdAt"],
      include: [
        {
          model: ProductItem,
          attributes: ["id", "sku", "price", "qty"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách sản phẩm" });
  }
};

// 📌 Lấy thông tin chi tiết sản phẩm
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      attributes: ["id", "name", "description", "category_id", "createdAt"],
      include: [
        {
          model: ProductItem,
          attributes: ["id", "sku", "price", "qty"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin sản phẩm" });
  }
};

// 📌 Thêm mới sản phẩm
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category_id, product_items } = req.body;

    const newProduct = await Product.create({ name, description, category_id });

    if (product_items && product_items.length > 0) {
      await Promise.all(
        product_items.map(async (item) => {
          await ProductItem.create({
            product_id: newProduct.id,
            sku: item.sku,
            price: item.price,
            qty: item.qty,
          });
        })
      );
    }

    res.status(201).json({ message: "Thêm sản phẩm thành công", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Lỗi server khi thêm sản phẩm" });
  }
};

// 📌 Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category_id } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    await product.update({ name, description, category_id });
    res.status(200).json({ message: "Cập nhật sản phẩm thành công", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật sản phẩm" });
  }
};

// 📌 Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    await product.destroy();
    res.status(200).json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Lỗi server khi xóa sản phẩm" });
  }
};
