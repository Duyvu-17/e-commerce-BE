
import Discount from "../models/Discount.js";
import Product from "../models/Product.js";
import DiscountProduct from "../models/DiscountProduct.js";
import sequelize from '../config/database.js';

async function seedDiscountsAndProducts() {
  try {
    // Đồng bộ lại các model với database
    await sequelize.sync();

    // Tạo các mã giảm giá
    const discount1 = await Discount.create({
      code: 'DISCOUNT10',
      name: 'Giảm giá 10%',
      description: 'Giảm 10% cho tất cả sản phẩm',
      discount_type: 'percentage',
      discount_value: 10.00,
      minimum_purchase: 100000,
      usage_limit: 100,
      start_date: new Date(),
      end_date: new Date('2025-12-31'),
    });

    const discount2 = await Discount.create({
      code: 'DISCOUNT20',
      name: 'Giảm giá 20%',
      description: 'Giảm 20% cho sản phẩm cụ thể',
      discount_type: 'percentage',
      discount_value: 20.00,
      minimum_purchase: 150000,
      usage_limit: 100,
      start_date: new Date(),
      end_date: new Date('2025-12-31'),
    });

    console.log('Các mã giảm giá đã được tạo thành công!');

    // Lấy sản phẩm từ bảng Product (Giả sử bạn có sản phẩm với tên 'Product A' và 'Product B')
    const product1 = await Product.findOne({ where: { name: 'OnePlus 11' } });
    const product2 = await Product.findOne({ where: { name: 'Xiaomi 13 Pro' } });

    if (!product1 || !product2) {
      throw new Error('Sản phẩm không tồn tại trong cơ sở dữ liệu.');
    }

    // Liên kết mã giảm giá với các sản phẩm
    await DiscountProduct.bulkCreate([
      {
        discount_id: discount1.id,
        product_id: product1.id,
      },
      {
        discount_id: discount2.id,
        product_id: product2.id,
      },
    ]);

    console.log('Liên kết mã giảm giá với sản phẩm đã được tạo thành công!');
  } catch (error) {
    console.error('Có lỗi khi tạo mã giảm giá và liên kết sản phẩm:', error);
  } finally {
    // Đóng kết nối sau khi hoàn thành
    await sequelize.close();
  }
}

// Chạy seed
seedDiscountsAndProducts();
