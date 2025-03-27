import  DataTypes  from "sequelize";
import sequelize from "../config/database.js";
import Customer from "./Customer.js";


const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  Customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: "id",
    },
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "processing", "shipped", "completed", "cancelled"),
    defaultValue: "pending",
  },
});

Order.belongsTo(Customer, { foreignKey: "Customer_id" });

export default Order;
