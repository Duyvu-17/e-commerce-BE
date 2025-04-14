// seedCategories.js
import sequelize from '../config/database.js';
import Category from "../models/Category.js";

const categories = [
  {
    name: 'Điện thoại',
    description: 'Các loại điện thoại thông minh hiện đại.',
    image: 'https://example.com/images/dien-thoai.jpg',
  },
  {
    name: 'Laptop',
    description: 'Máy tính xách tay cho học tập và làm việc.',
    image: 'https://example.com/images/laptop.jpg',
  },
  {
    name: 'Phụ kiện',
    description: 'Tai nghe, sạc, ốp lưng và các phụ kiện khác.',
    image: 'https://example.com/images/phu-kien.jpg',
  },
];

async function seedCategories() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối cơ sở dữ liệu thành công.');

    for (const category of categories) {
      await Category.create({
        ...category,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    console.log('🌱 Seed dữ liệu Category thành công!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed thất bại:', error);
    process.exit(1);
  }
}

seedCategories();
