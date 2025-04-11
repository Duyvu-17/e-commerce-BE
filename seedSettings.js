// seedSettings.js
import sequelize from './src/config/database.js';
import Settings from './src/models/Settings.js';

const settings = [
  {
    setting_key: 'low_stock_threshold',
    setting_value: '20',
    setting_group: 'inventory',
    description: 'Ngưỡng cảnh báo sắp hết hàng.',
    is_public: false,
  },
  {
    setting_key: 'out_of_stock_threshold',
    setting_value: '5',
    setting_group: 'inventory',
    description: 'Ngưỡng cảnh báo hết hàng.',
    is_public: false,
  },
];

async function seedSettings() {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối cơ sở dữ liệu thành công.');

    for (const setting of settings) {
      await Settings.findOrCreate({
        where: { setting_key: setting.setting_key },
        defaults: {
          ...setting,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    }

    console.log('🌱 Seed dữ liệu Settings thành công!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed Settings:', error);
    process.exit(1);
  }
}

seedSettings();
