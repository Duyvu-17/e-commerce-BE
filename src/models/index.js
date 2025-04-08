import Address from './Address.js';
import BankTransferInfo from "./BankTransferInfo.js";
import Banner from './Banner.js';
import Blog from './Blog.js';
import BlogCategory from './BlogCategory.js';
import BlogCategoryRelation from './BlogCategoryRelation.js';
import BlogTag from './BlogTag.js';
import Cart from './Cart.js';
import CartItem from './CartItem.js';
import Category from './Category.js';
import ContactMessage from './ContactMessage.js';
import CreditCardInfo from './CreditCardInfo.js';
import Customer from "./Customer.js";
import CustomerInfo from "./CustomerInfo.js";
import CustomerPaymentMethod from "./CustomerPaymentMethod.js";
import Discount from './Discount.js';
import DiscountCategory from './DiscountCategory.js';
import DiscountProduct from './DiscountProduct.js';
import DiscountUsage from './DiscountUsage.js';
import Employee from './Employee.js';
import FAQ from './FAQ.js';
import Inventory from "./Inventory.js";
import InventoryHistory from './InventoryHistory.js';
import Notification from './Notification.js';
import Orders from "./Orders.js";
import OrderItem from './OrderItem.js';
import OrderTracking from './OrderTracking.js';
import PayPalInfo from './PayPalInfo.js';
import Product from "./Product.js";
import ProductImage from './ProductImage.js';
import ProductItem from "./ProductItem.js";
import ProductTag from './ProductTag.js';
import Review from './Review.js';
import ReviewImage from './ReviewImage.js';
import Shipping from './Shipping.js';
import ShippingAddress from './ShippingAddress.js';
import Settings from './Settings.js';
import Tag from './Tag.js';
import Transaction from './Transaction.js';
import Wishlist from './Wishlist.js';
import sequelize from '../config/database.js';
import Role from './Role.js';




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
  ReviewImage,
  Address,
  Banner,
  Blog,
  BlogCategory,
  BlogCategoryRelation,
  BlogTag,
  ContactMessage,
  Discount,
  DiscountCategory,
  DiscountProduct,
  DiscountUsage,
  FAQ,
  Inventory,
  InventoryHistory,
  Notification,
  OrderTracking,
  ProductTag,
  Shipping,
  ShippingAddress,
  Tag,
  Transaction,
  Wishlist,
  Settings,
  Orders,
  OrderItem,
  Role
};

export default db;
