const sequelize = require("../config/database");
const Customer = require("./Customer");
const CustomerPaymentMethod = require("./CustomerPaymentMethod");
const BankTransferInfo = require("./BankTransferInfo");
const PayPalInfo = require("./PayPalInfo");
const CreditCardInfo = require("./CreditCardInfo");
const CustomerInfo = require("./CustomerInfo");
const ProductItem = require("./ProductItem");
const Product = require("./Product");
const ProductImage = require("./ProductImage");
const Employee = require("./Employee");

// Quan hệ giữa Customer và CustomerPaymentMethod
Customer.hasMany(CustomerPaymentMethod, { foreignKey: "userId" });
CustomerPaymentMethod.belongsTo(Customer, { foreignKey: "userId" });

// Liên kết CustomerPaymentMethod với các phương thức thanh toán
CustomerPaymentMethod.belongsTo(BankTransferInfo, { foreignKey: "paymentId", constraints: false });
CustomerPaymentMethod.belongsTo(PayPalInfo, { foreignKey: "paymentId", constraints: false });
CustomerPaymentMethod.belongsTo(CreditCardInfo, { foreignKey: "paymentId", constraints: false });

// Liên kết Customer với CustomerInfo
Customer.hasOne(CustomerInfo, { foreignKey: "customerId", as: "info" });
CustomerInfo.belongsTo(Customer, { foreignKey: "customerId" });

// Liên kết Product với ProductItem và ProductImage
Product.hasMany(ProductItem, { foreignKey: "productId", as: "items" });
ProductItem.belongsTo(Product, { foreignKey: "productId" });

ProductItem.hasMany(ProductImage, { foreignKey: "productItemId", as: "images" });
ProductImage.belongsTo(ProductItem, { foreignKey: "productItemId" });



// Thêm Employee vào database
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
};

module.exports = db;
