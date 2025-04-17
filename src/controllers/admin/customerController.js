import CustomerInfo from "../../models/CustomerInfo.js";
import CustomerPaymentMethod from "../../models/CustomerPaymentMethod.js";
import Orders from "../../models/Orders.js";
import OrderItem from "../../models/OrderItem.js";
import ProductItem from "../../models/ProductItem.js";
import Product from "../../models/Product.js";
import ProductImage from "../../models/ProductImage.js";
import Customer from "../../models/Customer.js";
import sequelize from "../../config/database.js";



const customerController = {
  // 📌 Lấy danh sách khách hàng
  getCustomers: async (req, res, next) => {
    try {
      const customers = await Customer.findAll({
        attributes: {
          include: [
            // Tính tổng chi tiêu của customer
            [
              sequelize.literal(`(
                SELECT COALESCE(SUM(oi.quantity * oi.unit_price), 0)
                FROM OrderItem oi
                JOIN Orders o ON oi.order_id = o.id
                WHERE o.customer_id = Customer.id
              )`),
              "totalSpent",
            ],
            // Lấy thời gian đơn hàng cuối cùng của customer
            [
              sequelize.literal(`(
                SELECT MAX(o.created_at)
                FROM Orders o
                WHERE o.customer_id = Customer.id
              )`),
              "lastOrder",
            ],
            // Lấy số lượng đơn hàng của customer
            [
              sequelize.literal(`(
                SELECT COUNT(o.id)
                FROM Orders o
                WHERE o.customer_id = Customer.id
              )`),
              "ordersCount",
            ],
          ],
        },
        include: [
          {
            model: CustomerInfo,
            attributes: ["fullname", "phone_number", "avatar"],
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
// 📌 Lấy thông tin chi tiết khách hàng
getCustomerById: async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id, {
      attributes: {
        include: [
          "id", "email", "status", "isVerified", "created_at",
          // Tổng số tiền đã chi
          [
            sequelize.literal(`(
              SELECT COALESCE(SUM(oi.quantity * oi.unit_price), 0)
              FROM OrderItem oi
              JOIN Orders o ON oi.order_id = o.id
              WHERE o.customer_id = Customer.id
            )`),
            "totalSpent",
          ],
          // Lần mua hàng gần nhất
          [
            sequelize.literal(`(
              SELECT MAX(o.created_at)
              FROM Orders o
              WHERE o.customer_id = Customer.id
            )`),
            "lastPurchase",
          ],
        ]
      },
      include: [
        {
          model: CustomerInfo,
          attributes: [
            "fullname", "first_name", "last_name", "avatar", "address",
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
                  attributes: ["name","sku"],
                  include: [
                    {
                      model: ProductImage,
                      attributes: ["image_url"],
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
    console.error("Lỗi khi lấy thông tin khách hàng:", error);
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
