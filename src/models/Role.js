import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Role extends Model {
  static associate(models) {
    // Một vai trò có thể được gán cho nhiều nhân viên
    Role.hasMany(models.Employee, { foreignKey: 'role_id' });
  }
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    permissions: {
      type: DataTypes.TEXT,
      allowNull: true,  // Có thể là null nếu không có công việc cụ thể
    },
  },
  {
    sequelize,
    modelName: 'Role',
    tableName: 'Roles', // Tên bảng trong CSDL
    timestamps: false,
  }
);

export default Role;
