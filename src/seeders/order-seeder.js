import db from '../models/index.js';
import { Sequelize } from 'sequelize';

const seedOrders = async () => {
  const transaction = await db.sequelize.transaction();

  try {
    for (let i = 1; i <= 10; i++) {
      // Lấy product item ngẫu nhiên từ DB (hoặc giả định product_item_id = i)
      const productItem = await db.ProductItem.findOne({ where: { id: i } });

      if (!productItem) {
        console.warn(`⚠️ ProductItem id ${i} không tồn tại. Bỏ qua đơn hàng này.`);
        continue;
      }

      const quantity = 2;
      const unitPrice = productItem.price;
      const totalAmount = quantity * unitPrice;
      const shippingFee = 10;

      // Tạo đơn vị vận chuyển (nếu chưa có sẵn)
      let shipping = await db.Shipping.findOne({ where: { name: 'GHN Express' } });
      if (!shipping) {
        shipping = await db.Shipping.create({
          name: 'GHN Express',
          shipping_method: 'standard',
          price: shippingFee,
          estimated_days: 3,
          is_active: true,
        }, { transaction });
      }

      // Tạo đơn hàng
      const order = await db.Orders.create({
        customer_id: i,
        total_amount: totalAmount + shippingFee,
        status: 'pending',
        order_number: `ORD-${Date.now()}-${i}`,
        shipping_id: shipping.id,
        created_at: new Date(),
        updated_at: new Date(),
      }, { transaction });

      // Tạo OrderItem
      await db.OrderItem.create({
        order_id: order.id,
        product_item_id: productItem.id,
        quantity,
        unit_price: unitPrice,
        discounted_price: totalAmount, // chưa áp dụng discount thật
      }, { transaction });

      // Tạo địa chỉ giao hàng (ShippingAddress)
      await db.ShippingAddress.create(
        {
          order_id: order.id,
          full_name: `Customer ${i}`,
          street_address: '123 ABC Street',
          district: 'Ba Đình',
          ward: 'Phúc Xá',
          phone_number: `09000000${i}`,
        },
        { transaction }
      );
      // Tạo tracking
      await db.OrderTracking.create({
        order_id: order.id,
        status: 'shipped',
        description: 'Đơn hàng đã được gửi đi từ kho.',
        location: 'Kho Hà Nội',
        updated_by: 1, // giả định nhân viên ID 1
        created_at: new Date(),
      }, { transaction });
    }

    await transaction.commit();
    console.log('✅ Đã seed 10 đơn hàng thành công!');
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Lỗi khi seed đơn hàng:', error);
  }
};

seedOrders();
