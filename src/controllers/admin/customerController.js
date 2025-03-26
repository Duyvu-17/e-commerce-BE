const Customer = require("../../models/Customer");

// 📌 Lấy danh sách khách hàng
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      attributes: ["id", "name", "email", "phone", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách khách hàng" });
  }
};

// 📌 Lấy thông tin chi tiết khách hàng
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id, {
      attributes: ["id", "name", "email", "phone", "address", "createdAt"],
    });

    if (!customer) {
      return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin khách hàng" });
  }
};

// 📌 Cập nhật thông tin khách hàng
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    }

    await customer.update({ name, phone, address });
    res.status(200).json({ message: "Cập nhật khách hàng thành công", customer });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật khách hàng" });
  }
};

// 📌 Xóa khách hàng
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    }

    await customer.destroy();
    res.status(200).json({ message: "Xóa khách hàng thành công" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Lỗi server khi xóa khách hàng" });
  }
};
