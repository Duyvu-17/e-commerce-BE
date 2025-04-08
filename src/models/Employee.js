import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Employee extends Model {
  static associate(models) {
    // Quan hệ với bảng Blog
    Employee.hasMany(models.Blog, { foreignKey: 'author_id' });
    Employee.hasMany(models.ContactMessage, { foreignKey: 'assigned_to' });
    Employee.hasMany(models.OrderTracking, { foreignKey: 'updated_by' });
    Employee.hasMany(models.InventoryHistory, { foreignKey: 'changed_by' });
    
    // Quan hệ với Role
    Employee.belongsTo(models.Role, { foreignKey: 'role_id' }); 
  }
}

Employee.init(
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
    full_name: {
      type: DataTypes.STRING(255),
    },
    password: {
      type: DataTypes.STRING(255),
    },
    avatar: {
      type: DataTypes.STRING(255),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    role_id: {  
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles',
        key: 'id',
      },
      allowNull: false,
    },  
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      allowNull: false,
    },
    refreshToken: { 
      type: DataTypes.STRING(255),
      allowNull: true, 
    },
  },
  
  {
    sequelize,
    modelName: 'Employee',
    tableName: 'Employee',
    timestamps: false,
  }
);

export default Employee;
