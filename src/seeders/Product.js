import Category from "../models/Category.js";
import Product from "../models/Product.js";
import ProductItem from "../models/ProductItem.js";
import ProductImage from "../models/ProductImage.js";
import sequelize from '../config/database.js';

async function seedProducts() {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối DB thành công');

    // Lấy ID của category đầu tiên (hoặc tự tạo nếu chưa có)
    let category = await Category.findOne();
    if (!category) {
      category = await Category.create({
        name: 'Thời trang',
        description: 'Sản phẩm thời trang chất lượng cao',
        image: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Danh sách sản phẩm mới
    const productsData = [
      {
        name: 'Áo Thun Cotton Classic',
        description: 'Áo thun cotton thoáng mát và thoải mái cho mọi hoạt động hàng ngày. Được làm từ chất liệu vải cotton cao cấp, mềm mại và dễ chịu trên da. Thiết kế cổ tròn cổ điển và tay ngắn tạo nên vẻ ngoài đơn giản nhưng không kém phần thanh lịch.',
        summary: 'Áo thun cotton cao cấp với thiết kế cổ điển.',
        slug: 'ao-thun-cotton-classic',
        image: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        price: 299000,
        category_id: 1, // ID danh mục (ví dụ: thời trang)
        status: 'in stock',
        items: [
          {
            name: 'Áo Thun Cotton Classic - Trắng size S',
            sku: 'AT-CLASSIC-TR-S',
            price: 299000,
            color: 'Trắng',
            size: 'S',
            attributes: { material: '100% Cotton', care: 'Giặt máy với nước lạnh' },
          },
          {
            name: 'Áo Thun Cotton Classic - Trắng size M',
            sku: 'AT-CLASSIC-TR-M',
            price: 299000,
            color: 'Trắng',
            size: 'M',
            attributes: { material: '100% Cotton', care: 'Giặt máy với nước lạnh' },
          },
          {
            name: 'Áo Thun Cotton Classic - Đen size S',
            sku: 'AT-CLASSIC-DE-S',
            price: 299000,
            color: 'Đen',
            size: 'S',
            attributes: { material: '100% Cotton', care: 'Giặt máy với nước lạnh' },
          },
        ],
      },
      {
        name: 'Quần Jeans Slim Fit',
        description: 'Quần jeans ôm dáng hiện đại, được làm từ chất liệu denim cao cấp. Thiết kế vừa vặn hoàn hảo, tôn lên dáng người mặc với sự thoải mái vừa đủ. Chất liệu bền bỉ, co giãn nhẹ giúp duy trì form dáng qua nhiều lần sử dụng.',
        summary: 'Quần jeans ôm dáng với độ co giãn thoải mái.',
        slug: 'quan-jeans-slim-fit',
        image: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        price: 599000,
        category_id: 1, // ID danh mục (ví dụ: thời trang)
        status: 'in stock',
        items: [
          {
            name: 'Quần Jeans Slim Fit - Xanh size 30',
            sku: 'QJ-SLIM-XA-30',
            price: 599000,
            color: 'Xanh',
            size: '30',
            attributes: { material: '98% Cotton, 2% Spandex', care: 'Giặt máy với nước lạnh, sấy khô ở nhiệt độ thấp' },
          },
          {
            name: 'Quần Jeans Slim Fit - Xanh size 32',
            sku: 'QJ-SLIM-XA-32',
            price: 599000,
            color: 'Xanh',
            size: '32',
            attributes: { material: '98% Cotton, 2% Spandex', care: 'Giặt máy với nước lạnh, sấy khô ở nhiệt độ thấp' },
          },
        ],
      },
      {
        name: 'Túi Đeo Chéo Da',
        description: 'Túi đeo chéo thanh lịch làm từ da thật cao cấp. Phụ kiện thời trang này có nhiều ngăn tiện lợi, dây đeo điều chỉnh được và các chi tiết kim loại màu vàng sang trọng. Sử dụng được trong cả trang phục thường ngày và dự tiệc.',
        summary: 'Túi đeo chéo da thật với nhiều ngăn tiện dụng.',
        slug: 'tui-deo-cheo-da',
        image: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        price: 899000,
        category_id: 1, // ID danh mục (ví dụ: phụ kiện)
        status: 'in stock',
        items: [
          {
            name: 'Túi Đeo Chéo Da - Nâu',
            sku: 'TD-CHEO-NA',
            price: 899000,
            color: 'Nâu',
            size: 'Tiêu chuẩn',
            attributes: { material: 'Da thật 100%', care: 'Lau bằng khăn ẩm' },
          },
          {
            name: 'Túi Đeo Chéo Da - Đen',
            sku: 'TD-CHEO-DE',
            price: 899000,
            color: 'Đen',
            size: 'Tiêu chuẩn',
            attributes: { material: 'Da thật 100%', care: 'Lau bằng khăn ẩm' },
          },
        ],
      },
      {
        name: 'Tai Nghe Bluetooth Không Dây',
        description: 'Tai nghe hiệu suất cao với công nghệ Bluetooth 5.0. Trải nghiệm chất lượng âm thanh sống động, tính năng chống ồn chủ động và thời lượng pin lên đến 30 giờ. Thiết kế công thái học đảm bảo sự thoải mái khi sử dụng lâu.',
        summary: 'Tai nghe không dây cao cấp với tính năng chống ồn.',
        slug: 'tai-nghe-bluetooth-khong-day',
        image: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        price: 1299000,
        category_id: 2, // ID danh mục (ví dụ: thiết bị điện tử)
        status: 'in stock',
        items: [
          {
            name: 'Tai Nghe Bluetooth Không Dây - Đen',
            sku: 'TN-BT-DE',
            price: 1299000,
            color: 'Đen',
            size: 'Tiêu chuẩn',
            attributes: { connectivity: 'Bluetooth 5.0', batteryLife: '30 giờ', features: ['Chống ồn chủ động', 'Sạc nhanh'] },
          },
          {
            name: 'Tai Nghe Bluetooth Không Dây - Trắng',
            sku: 'TN-BT-TR',
            price: 1299000,
            color: 'Trắng',
            size: 'Tiêu chuẩn',
            attributes: { connectivity: 'Bluetooth 5.0', batteryLife: '30 giờ', features: ['Chống ồn chủ động', 'Sạc nhanh'] },
          },
        ],
      },
      {
        name: 'Đồng Hồ Thông Minh Theo Dõi Sức Khỏe',
        description: 'Đồng hồ thông minh với tính năng theo dõi nhịp tim, giấc ngủ và GPS. Màn hình cảm ứng sống động cho phép truy cập dễ dàng vào dữ liệu luyện tập, thông báo và ứng dụng. Thiết kế chống nước phù hợp cho bơi lội và các hoạt động ngoài trời.',
        summary: 'Đồng hồ thông minh đa chức năng với theo dõi nhịp tim.',
        slug: 'dong-ho-thong-minh-theo-doi-suc-khoe',
        image: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        price: 1499000,
        category_id: 2, // ID danh mục (ví dụ: thiết bị điện tử)
        status: 'in stock',
        items: [
          {
            name: 'Đồng Hồ Thông Minh Theo Dõi Sức Khỏe - Đen',
            sku: 'DH-TM-DE',
            price: 1499000,
            color: 'Đen',
            size: 'Tiêu chuẩn',
            attributes: { waterResistant: '50m', batteryLife: '7 ngày', features: ['Theo dõi nhịp tim', 'GPS', 'Theo dõi giấc ngủ'] },
          },
          {
            name: 'Đồng Hồ Thông Minh Theo Dõi Sức Khỏe - Xanh',
            sku: 'DH-TM-XA',
            price: 1499000,
            color: 'Xanh',
            size: 'Tiêu chuẩn',
            attributes: { waterResistant: '50m', batteryLife: '7 ngày', features: ['Theo dõi nhịp tim', 'GPS', 'Theo dõi giấc ngủ'] },
          },
          {
            name: 'Đồng Hồ Thông Minh Theo Dõi Sức Khỏe - Hồng',
            sku: 'DH-TM-HO',
            price: 1499000,
            color: 'Hồng',
            size: 'Tiêu chuẩn',
            attributes: { waterResistant: '50m', batteryLife: '7 ngày', features: ['Theo dõi nhịp tim', 'GPS', 'Theo dõi giấc ngủ'] },
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
        image: productData.image,
        price: productData.price,
        sku: `SKU-${productData.slug}`,
        barcode: `BARCODE-${productData.slug}`,
        status: productData.status, // Thêm status vào sản phẩm
        category_id: category.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Tạo các model (product items) cho sản phẩm
      const productItems = await ProductItem.bulkCreate(
        productData.items.map(item => ({
          product_id: product.id,
          name: item.name,
          sku: item.sku,
          weight: 250,
          dimensions: '40x30x5 cm',
          attributes: JSON.stringify(item.attributes),
          barcode: `BARCODE-${item.sku}`, // Tạo mã vạch từ SKU
          status: 'active', // Đặt trạng thái mặc định cho item
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
          image_url: productData.image,
          is_primary: true, // Đặt hình ảnh đầu tiên là primary
        },
        ...productItems.map((item, index) => ({
          product_id: product.id,
          product_item_id: item.id,
          image_url: `https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D`,
          is_primary: index === 0, // Đặt ảnh đầu tiên của mỗi product item là primary
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
