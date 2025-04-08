// models/Address.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Address extends Model {
  static associate(models) {
    Address.belongsTo(models.Customer, { foreignKey: 'customer_id' });
  }
}

Address.init(
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
    title: {
      type: DataTypes.STRING(255),
    },
    address_line_1: {
      type: DataTypes.STRING(255),
    },
    address_line_2: {
      type: DataTypes.STRING(255),
    },
    country: {
      type: DataTypes.STRING(255),
    },
    city: {
      type: DataTypes.STRING(255),
    },
    postal_code: {
      type: DataTypes.STRING(255),
    },
    landmark: {
      type: DataTypes.STRING(255),
    },
    phone_number: {
      type: DataTypes.STRING(255),
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Address',
    tableName: 'Address',
    timestamps: false,
  }
);

export default Address;
