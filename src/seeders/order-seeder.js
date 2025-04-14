import db from '../models/index.js';

const seedOrders = async () => {
  try {
    for (let i = 1; i <= 10; i++) {
      // Lấy product item ngẫu nhiên từ DB (hoặc giả định product_item_id = i)
      const productItem = await db.ProductItem.findOne({ where: { id: i } });

      if (!productItem) {
        console.warn(`⚠️ ProductItem id ${i} không tồn tại. Bỏ qua đơn hàng này.`);
        continue;
      }

      // Tính tổng giá
      const quantity = 2;
      const unitPrice = productItem.price;
      const totalPrice = quantity * unitPrice;
      const shippingFee = 10;

      // 1. Tạo đơn hàng
      const order = await db.Orders.create({
        customer_id: i, // đã có sẵn 10 khách hàng với id từ 1 đến 10
        total_price: totalPrice + shippingFee,
        status: 'pending',  
        order_date: new Date(),
        payment_method: 'credit_card',
        shipping_fee: shippingFee,
      });

      // 2. Tạo OrderItem
      await db.OrderItem.create({
        order_id: order.id,
        product_item_id: productItem.id,
        quantity,
        unit_price: unitPrice,
      });

      // 3. Tạo thông tin shipping
      await db.Shipping.create({
        order_id: order.id,
        name: 'GHN Express',
        shipping_method: 'standard',
        tracking_number: `TRK${Date.now()}${i}`,
        shipped_date: new Date(),
        delivery_date: null,
        status: 'shipped',
      });
    }

    console.log('✅ Đã seed 10 đơn hàng thành công!');
  } catch (error) {
    console.error('❌ Lỗi khi seed đơn hàng:', error);
  }
};

seedOrders();
