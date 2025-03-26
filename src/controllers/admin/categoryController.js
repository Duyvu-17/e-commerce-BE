const Category = require("../../models/Category")

// 📌 Lấy danh sách danh mục
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name", "image", "status", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh mục" });
  }
};

// 📌 Lấy chi tiết danh mục theo ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      attributes: ["id", "name", "image", "status", "createdAt"],
    });

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin danh mục" });
  }
};

// 📌 Tạo danh mục mới
exports.createCategory = async (req, res) => {
  try {
    const { name, image, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Tên danh mục không được để trống" });
    }

    const newCategory = await Category.create({ name, image, status });
    res.status(201).json({ message: "Danh mục đã được tạo", category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Lỗi server khi tạo danh mục" });
  }
};

// 📌 Cập nhật danh mục
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, status } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    await category.update({ name, image, status });
    res.status(200).json({ message: "Cập nhật danh mục thành công", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật danh mục" });
  }
};

// 📌 Xóa danh mục
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    await category.destroy();
    res.status(200).json({ message: "Xóa danh mục thành công" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Lỗi server khi xóa danh mục" });
  }
};
