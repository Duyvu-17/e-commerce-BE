import  DataTypes  from "sequelize";
import sequelize from "../config/database.js";

const Wishlist = sequelize.define("Wishlist", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customerId: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: "Customers",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  productId: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: "Products",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});


Wishlist.associate = (models) => {
  Wishlist.belongsTo(models.Customer, { foreignKey: "customerId", as: "customer" });
  Wishlist.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
};

export default Wishlist;
