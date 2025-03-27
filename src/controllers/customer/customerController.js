import Customer from "../../models/Customer.js";
import CustomerInfo from "../../models/CustomerInfo.js";

const customerController = {
  getProfile: async (req, res) => {
    try {
      const customerId = req.user.id;

      const customer = await Customer.findByPk(customerId, {
        attributes: ["id", "email", "createdAt"],
        include: [
          {
            model: CustomerInfo,
            as: "info",
            attributes: ["fullname", "phoneNumber", "address", "city", "state", "postalCode", "country", "dateOfBirth", "gender", "avatar"],
          },
        ],
      });

      if (!customer) {
        return res.status(404).json({ message: "Khách hàng không tồn tại" });
      }

      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const customerId = req.user.id;
      const { fullname, phoneNumber, address, city, state, postalCode, country, dateOfBirth, gender, avatar } = req.body;

      // Kiểm tra xem có dữ liệu hay không
      let customerInfo = await CustomerInfo.findOne({ where: { customerId } });

      if (!customerInfo) {
        return res.status(404).json({ message: "Thông tin khách hàng không tồn tại" });
      }

      // Cập nhật dữ liệu
      await customerInfo.update(
        { fullname, phoneNumber, address, city, state, postalCode, country, dateOfBirth, gender, avatar }
      );

      // Lấy lại dữ liệu sau khi cập nhật
      customerInfo = await CustomerInfo.findOne({
        where: { customerId },
        attributes: ["fullname", "phoneNumber", "address", "city", "state", "postalCode", "country", "dateOfBirth", "gender", "avatar"],
      });

      res.json({ message: "Cập nhật thông tin thành công", customerInfo });
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};

export default customerController;
