import Orders from "../../models/Orders.js";
import OrderItem from "../../models/OrderItem.js";
import Customer from "../../models/Customer.js";
import CustomerInfo from "../../models/CustomerInfo.js";
import ShippingAddress from "../../models/ShippingAddress.js";
import ProductItem from './../../models/ProductItem.js';
import Product from './../../models/Product.js';
import Shipping from './../../models/Shipping.js';
import ProductImage from './../../models/ProductImage.js';

// Danh sách trạng thái hợp lệ
const VALID_ORDER_STATUSES = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];

// Lấy danh sách đơn hàng
const getOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll({
      attributes: ["id", "customer_id", "total_amount", "status", "created_at"],
      include: [
        {
          model: Customer,
          attributes: ["id", "email"],
          include: [
            {
              model: CustomerInfo,
              attributes: ["phone_number", "avatar"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách đơn hàng" });
  }
};

// Lấy chi tiết đơn hàng theo ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
    }

    const order = await Orders.findByPk(id, {
      attributes: ["id", "customer_id", "total_amount", "status", "created_at"],
      include: [
        {
          model: Customer,
          attributes: ["id", "email"],
          include: [
            {
              model: CustomerInfo,
              attributes: ["fullname", "phone_number", "avatar"]
            }
          ]
        },
        {
          model: OrderItem,
          attributes: ["id", "product_item_id", "quantity", "unit_price", "discounted_price"],
          include: [
            {
              model: ProductItem,
              attributes: ["id", "sku"],
              include: [
                {
                  model: Product,
                  attributes: ["name"],
                  include: [
                    {
                      model: ProductImage,
                      attributes: ["image_url"],
                      where: { is_primary: true },
                      required: false
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          model: Shipping,
          attributes: ["id", "name", "price", "estimated_days"]
        },
        {
          model: ShippingAddress,
          attributes: ["id", "full_name", "phone_number", "address_line_1", "address_line_2", "country", "city", "postal_code"]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin đơn hàng" });
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Trạng thái không hợp lệ. Các trạng thái hợp lệ: ${VALID_ORDER_STATUSES.join(', ')}` });
    }

    const order = await Orders.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    await order.update({ status });
    res.status(200).json({ message: "Cập nhật trạng thái đơn hàng thành công", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái đơn hàng" });
  }
};

// Xóa đơn hàng
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Orders.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    await order.destroy();
    res.status(200).json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Lỗi server khi xóa đơn hàng" });
  }
};

const orderController = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};

export default orderController;
