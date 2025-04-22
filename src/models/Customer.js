import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Customer extends Model {
  static associate(models) {
    // Các mối quan hệ giữa Customer và các mô hình khác
    Customer.hasOne(models.CustomerInfo, { foreignKey: 'customer_id' });
    Customer.hasMany(models.Address, { foreignKey: 'customer_id' });
    Customer.hasOne(models.Cart, { foreignKey: 'customer_id' });
    Customer.hasMany(models.CustomerPaymentMethod, { foreignKey: 'customer_id' });
    Customer.hasMany(models.Orders, { foreignKey: 'customer_id' });
    Customer.hasMany(models.Wishlist, { foreignKey: 'customer_id' });
    Customer.hasMany(models.Review, { foreignKey: 'customer_id' });
    Customer.hasMany(models.PasswordReset, { foreignKey: 'customer_id' });
    Customer.hasMany(models.Notification, { foreignKey: 'customer_id' });
    Customer.hasMany(models.DiscountUsage, { foreignKey: 'customer_id' });
  }
}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['active', 'inactive', 'banned']],
      }
    },
    last_activity: {
      type: DataTypes.DATE,
      allowNull: true,  
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Customer',
    tableName: 'Customer',
    timestamps: false,
  }
);

export default Customer;
