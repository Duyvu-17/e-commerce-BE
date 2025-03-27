import Order from "../../models/Order.js";
import OrderItem from "../../models/OrderItem.js";
import Customer from "../../models/Customer.js";


const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      attributes: ["id", "user_id", "total_price", "status", "createdAt"],
      include: [
        {
          model: Customer,
          attributes: ["id", "email", "phone_number"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách đơn hàng" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      attributes: ["id", "user_id", "total_price", "status", "createdAt"],
      include: [
        {
          model: Customer,
          attributes: ["id", "email", "phone_number"],
        },
        {
          model: OrderItem,
          attributes: ["id", "product_id", "product_name", "price", "quantity"],
        },
      ],
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

// 📌 Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
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

// 📌 Xóa đơn hàng
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

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