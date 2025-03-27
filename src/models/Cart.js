import  DataTypes  from "sequelize";
import sequelize from "../config/database.js";


const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    defaultValue: DataTypes.INTEGER,
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
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Cart.associate = (models) => {
  Cart.belongsTo(models.Customer, { foreignKey: "customerId", as: "customer" });
  Cart.hasMany(models.CartItem, { foreignKey: "cartId", as: "items" });
};

export default Cart;
