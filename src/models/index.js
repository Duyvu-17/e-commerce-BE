import sequelize from "../config/database.js";
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
import Cart from "./Cart.js";
import CartItem from "./CartItem.js";
import Review from "./Review.js";
import ReviewImage from "./ReviewImage.js";
import PasswordReset from "./PasswordReset.js";

// 🏦 Thiết lập quan hệ giữa Customer và PaymentMethod
Customer.hasMany(CustomerPaymentMethod, { foreignKey: "customerId" });
CustomerPaymentMethod.belongsTo(Customer, { foreignKey: "customerId" });

CustomerPaymentMethod.belongsTo(BankTransferInfo, { foreignKey: "paymentId", constraints: false });
CustomerPaymentMethod.belongsTo(PayPalInfo, { foreignKey: "paymentId", constraints: false });
CustomerPaymentMethod.belongsTo(CreditCardInfo, { foreignKey: "paymentId", constraints: false });

// 🧑‍💼 Thiết lập quan hệ giữa Customer và CustomerInfo
Customer.hasOne(CustomerInfo, { foreignKey: "customerId", as: "info" });
CustomerInfo.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

// 🏷️ Thiết lập quan hệ giữa Product, ProductItem và ProductImage
Product.hasMany(ProductItem, { foreignKey: "productId", as: "productItems" });
ProductItem.belongsTo(Product, { foreignKey: "productId" });

ProductItem.hasMany(ProductImage, { foreignKey: "productItemId", as: "productImages" });
ProductImage.belongsTo(ProductItem, { foreignKey: "productItemId" });

Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });

// 🛒 Thiết lập quan hệ giữa Cart và CartItem
Customer.hasOne(Cart, { foreignKey: "customerId", as: "cart" });
Cart.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

CartItem.belongsTo(ProductItem, { foreignKey: "productItemId", as: "productItem" });

// ⭐ Thiết lập quan hệ giữa Review và ReviewImage
Customer.hasMany(Review, { foreignKey: "customerId", as: "reviews" });
Review.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "productId", as: "product" });

Review.hasMany(ReviewImage, { foreignKey: "reviewId", as: "images" });
ReviewImage.belongsTo(Review, { foreignKey: "reviewId" });

// Thiết lập quan hệ với model Customer
PasswordReset.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });


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
  Category,
  Cart,
  CartItem,
  Review,
  ReviewImage
};

export default db;
