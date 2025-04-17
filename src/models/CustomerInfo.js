// models/CustomerInfo.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class CustomerInfo extends Model {
  static associate(models) {
    CustomerInfo.belongsTo(models.Customer, { foreignKey: 'customer_id' });
  }
}

CustomerInfo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customer',
        key: 'id',
      },
    },
    avatar: {
      type: DataTypes.STRING(255),
    },
    fullname: {
      type: DataTypes.STRING(255),
    },
    address: {
      type: DataTypes.STRING(255),
    },
    first_name: {
      type: DataTypes.STRING(255),
    },
    last_name: {
      type: DataTypes.STRING(255),
    },
    birth_date: {
      type: DataTypes.DATE,
    },
    phone_number: {
      type: DataTypes.STRING(255),
    },
  },
  {
    sequelize,
    modelName: 'CustomerInfo',
    tableName: 'CustomerInfo',
    timestamps: false,
  }
);

export default CustomerInfo;
