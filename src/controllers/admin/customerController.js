import Customer from "../../models/Customer.js";

const customerController = {
  // 📌 Lấy danh sách khách hàng
  getCustomers: async (req, res, next) => {
    try {
      const customers = await Customer.findAll({
        attributes: ["id", "name", "email", "phone", "createdAt"],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({ status: "success", data: customers });
    } catch (error) {
      next(error);
    }
  },

  // 📌 Lấy thông tin chi tiết khách hàng
  getCustomerById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const customer = await Customer.findByPk(id, {
        attributes: ["id", "name", "email", "phone", "address", "createdAt"],
      });

      if (!customer) {
        return res.status(404).json({ status: "error", message: "Không tìm thấy khách hàng" });
      }

      res.status(200).json({ status: "success", data: customer });
    } catch (error) {
      next(error);
    }
  },

  // 📌 Cập nhật thông tin khách hàng
  updateCustomer: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, phone, address } = req.body;

      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ status: "error", message: "Không tìm thấy khách hàng" });
      }

      await customer.update({ name, phone, address });
      res.status(200).json({ status: "success", message: "Cập nhật khách hàng thành công", data: customer });
    } catch (error) {
      next(error);
    }
  },

  // 📌 Xóa khách hàng
  deleteCustomer: async (req, res, next) => {
    try {
      const { id } = req.params;
      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({ status: "error", message: "Không tìm thấy khách hàng" });
      }

      await customer.destroy();
      res.status(200).json({ status: "success", message: "Xóa khách hàng thành công" });
    } catch (error) {
      next(error);
    }
  },
};

export default customerController;
