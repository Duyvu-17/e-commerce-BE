import Customer from "./Customer.js";
import CustomerPaymentMethod from "./CustomerPaymentMethod.js";
import BankTransferInfo from "./BankTransferInfo.js";
import PayPalInfo from "./PayPalInfo.js";
import CreditCardInfo from "./CreditCardInfo.js";
import CustomerInfo from "./CustomerInfo.js";
import ProductItem from "./ProductItem.js";
import Product from "./Product.js";
import ProductImage from "./ProductImage.js";
import Employee from "./Employee.js";
import Category from "./Category.js";
import sequelize from "../config/database.js";  

// Thiết lập quan hệ giữa các bảng
Customer.hasMany(CustomerPaymentMethod, { foreignKey: "CustomerId" });
CustomerPaymentMethod.belongsTo(Customer, { foreignKey: "CustomerId" });

CustomerPaymentMethod.belongsTo(BankTransferInfo, { foreignKey: "paymentId", constraints: false });
CustomerPaymentMethod.belongsTo(PayPalInfo, { foreignKey: "paymentId", constraints: false });
CustomerPaymentMethod.belongsTo(CreditCardInfo, { foreignKey: "paymentId", constraints: false });

Customer.hasOne(CustomerInfo, { foreignKey: "customerId", as: "info" });
CustomerInfo.belongsTo(Customer, { foreignKey: "customerId" });

Product.hasMany(ProductItem, { foreignKey: "productId", as: "productItems" });
ProductItem.belongsTo(Product, { foreignKey: "productId" });

ProductItem.hasMany(ProductImage, { foreignKey: "productItemId", as: "productsImages" });
ProductImage.belongsTo(ProductItem, { foreignKey: "productItemId" });

Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });

// Export sequelize dưới dạng default
const db = {
  sequelize, 
  Customer,
  CustomerPaymentMethod,
  BankTransferInfo,
  PayPalInfo,
  CreditCardInfo,
  CustomerInfo,
  Product,
  ProductItem,
  ProductImage,
  Employee,
  Category
};

export default db;
