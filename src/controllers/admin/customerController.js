import CustomerInfo from "../../models/CustomerInfo.js";
import CustomerPaymentMethod from "../../models/CustomerPaymentMethod.js";
import Orders from "../../models/Orders.js";
import OrderItem from "../../models/OrderItem.js";
import ProductItem from "../../models/ProductItem.js";
import Product from "../../models/Product.js";
import ProductImage from "../../models/ProductImage.js";
import Customer from "../../models/Customer.js";

const customerController = {
  // 📌 Lấy danh sách khách hàng
  getCustomers: async (req, res, next) => {
    try {
      const customers = await Customer.findAll({
        attributes: ["id", "email", "status", "isVerified", "created_at"],
        include: [
          {
            model: CustomerInfo,
            attributes: ["fullname", "phone_number"],
            required: false,
          },
        ],
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
        attributes: ["id", "email", "status", "isVerified", "created_at"],
        include: [
          {
            model: CustomerInfo,
            attributes: [
              "fullname", "first_name", "last_name", "avatar",
              "phone_number", "birth_date"
            ],
            required: false,
          },
          {
            model: CustomerPaymentMethod,
            attributes: ["id", "method_type", "is_active", "created_at"],
            required: false,
          },
          {
            model: Orders,
            attributes: ["id", "total_amount", "status", "created_at"],
            include: [
              {
                model: OrderItem,
                attributes: ["quantity", "unit_price", "discounted_price"],
                include: [
                  {
                    model: ProductItem,
                    attributes: ["sku"],
                    include: [
                      {
                        model: Product,
                        attributes: ["name"],
                        include: [
                          {
                            model: ProductImage,
                            attributes: ["image_url"],
                            where: { is_primary: true },
                            required: false,
                          },
                        ],
                        required: false,
                      },
                    ],
                    required: false,
                  },
                ],
                required: false,
              },
            ],
            required: false,
          },
        ],
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
