import Category from "../../models/Category.js";

// 📌 Lấy danh sách danh mục
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name"],
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh mục" });
  }
};

// 📌 Lấy chi tiết danh mục theo ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      attributes: ["id", "name"],
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
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const imagePath = req.file ? `/uploads/categories/${req.file.filename}` : null;
    console.log(imagePath);

    const newCategory = await Category.create({
      name,
      description,
      image: imagePath,
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.status(201).json(newCategory);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 📌 Cập nhật danh mục
const updateCategory = async (req, res) => {
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
const deleteCategory = async (req, res) => {
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

const categoryController = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryController;