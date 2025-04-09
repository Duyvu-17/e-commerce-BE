// seedProducts.js
import Category from "./src/models/Category.js";
import Product from "./src/models/Product.js";
import ProductItem from "./src/models/ProductItem.js";
import ProductImage from "./src/models/ProductImage.js";
import sequelize from './src/config/database.js';

async function seedProducts() {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối DB thành công');

    // Lấy ID của category đầu tiên (hoặc tự tạo nếu chưa có)
    let category = await Category.findOne();
    if (!category) {
      category = await Category.create({
        name: 'Điện tử',
        description: 'Thiết bị điện tử hiện đại',
        image: 'https://example.com/images/dien-tu.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Danh sách sản phẩm mới
    const productsData = [
      {
        name: 'iPhone 15 Pro Max',
        description: 'Điện thoại cao cấp của Apple',
        summary: 'iPhone với thiết kế titan mới, chip A17 Pro mạnh mẽ.',
        slug: 'iphone-15-pro-max',
        cover_image: 'https://example.com/images/iphone15.jpg',
        price: 1299.00,
        category_id: category.id,
        items: [
          {
            sku: 'IPH15PM-BLACK-128GB',
            price: 1099.00,
            color: 'Đen',
            size: '128GB',
            attributes: { chip: 'A17 Pro', camera: '48MP' },
          },
          {
            sku: 'IPH15PM-BLACK-256GB',
            price: 1199.00,
            color: 'Đen',
            size: '256GB',
            attributes: { chip: 'A17 Pro', camera: '48MP' },
          },
        ],
      },
      {
        name: 'Samsung Galaxy S23 Ultra',
        description: 'Điện thoại flagship của Samsung',
        summary: 'Màn hình lớn, camera 200MP, pin lâu.',
        slug: 'samsung-galaxy-s23-ultra',
        cover_image: 'https://example.com/images/s23-ultra.jpg',
        price: 1299.00,
        items: [
          {
            sku: 'SGS23U-BLACK-256GB',
            price: 1199.00,
            color: 'Đen',
            size: '256GB',
            attributes: { chip: 'Snapdragon 8 Gen 2', camera: '200MP' },
          },
          {
            sku: 'SGS23U-BLACK-512GB',
            price: 1399.00,
            color: 'Đen',
            size: '512GB',
            attributes: { chip: 'Snapdragon 8 Gen 2', camera: '200MP' },
          },
        ],
      },
      {
        name: 'Google Pixel 7 Pro',
        description: 'Điện thoại thông minh của Google',
        summary: 'Camera AI mạnh mẽ, hiệu suất tuyệt vời.',
        slug: 'google-pixel-7-pro',
        cover_image: 'https://example.com/images/pixel7pro.jpg',
        price: 1299.00,
        items: [
          {
            sku: 'GP7P-BLUE-128GB',
            price: 899.00,
            color: 'Xanh',
            size: '128GB',
            attributes: { chip: 'Google Tensor G2', camera: '50MP' },
          },
          {
            sku: 'GP7P-BLUE-256GB',
            price: 999.00,
            color: 'Xanh',
            size: '256GB',
            attributes: { chip: 'Google Tensor G2', camera: '50MP' },
          },
        ],
      },
      {
        name: 'OnePlus 11',
        description: 'Điện thoại cao cấp của OnePlus',
        summary: 'Thiết kế đẹp, hiệu năng mạnh mẽ.',
        slug: 'oneplus-11',
        cover_image: 'https://example.com/images/oneplus11.jpg',
        price: 1299.00,
        items: [
          {
            sku: 'OP11-GREEN-128GB',
            price: 749.00,
            color: 'Xanh lá',
            size: '128GB',
            attributes: { chip: 'Snapdragon 8 Gen 2', camera: '50MP' },
          },
          {
            sku: 'OP11-GREEN-256GB',
            price: 849.00,
            color: 'Xanh lá',
            size: '256GB',
            attributes: { chip: 'Snapdragon 8 Gen 2', camera: '50MP' },
          },
        ],
      },
      {
        name: 'Xiaomi 13 Pro',
        description: 'Điện thoại cao cấp của Xiaomi',
        summary: 'Camera Leica, hiệu suất mạnh mẽ.',
        slug: 'xiaomi-13-pro',
        cover_image: 'https://example.com/images/xiaomi13pro.jpg',
        price: 1299.00,
        items: [
          {
            sku: 'XM13P-WHITE-256GB',
            price: 999.00,
            color: 'Trắng',
            size: '256GB',
            attributes: { chip: 'Snapdragon 8 Gen 2', camera: '50MP' },
          },
          {
            sku: 'XM13P-WHITE-512GB',
            price: 1099.00,
            color: 'Trắng',
            size: '512GB',
            attributes: { chip: 'Snapdragon 8 Gen 2', camera: '50MP' },
          },
        ],
      },
    ];

    // Tạo sản phẩm
    for (const productData of productsData) {
      const product = await Product.create({
        name: productData.name,
        description: productData.description,
        summary: productData.summary,
        slug: productData.slug,
        cover_image: productData.cover_image,
        status: 'active',
        category_id: category.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Tạo các model (product items) cho sản phẩm
      const productItems = await ProductItem.bulkCreate(
        productData.items.map(item => ({
          product_id: product.id,
          sku: item.sku,
          weight: 240,
          dimensions: '146.6 x 70.6 x 8.3 mm',
          attributes: JSON.stringify(item.attributes),
          price: item.price,
          color: item.color,
          size: item.size,
          created_at: new Date(),
          updated_at: new Date(),
        }))
      );

      // Tạo hình ảnh cho sản phẩm
      await ProductImage.bulkCreate([
        {
          product_id: product.id,
          image_url: `${productData.cover_image}`,
          is_primary: true,
        },
        ...productItems.map((item, index) => ({
          product_id: product.id,
          product_item_id: item.id,
          image_url: `https://example.com/images/${productData.slug}-${item.size}.jpg`,
          is_primary: false,
        })),
      ]);
    }

    console.log('🌱 Seed Product/ProductItem/ProductImage thành công!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi khi seed:', err);
    process.exit(1);
  }
}

seedProducts();
