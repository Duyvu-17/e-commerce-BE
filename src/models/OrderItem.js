import  DataTypes  from "sequelize";
import sequelize from "../config/database.js";
import Order from "./Order.js";


const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Order,
      key: "id",
    },
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

OrderItem.belongsTo(Order, { foreignKey: "order_id" });

export default OrderItem;
