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


Product.hasMany(ProductItem, { foreignKey: 'product_id' });
ProductItem.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(ProductImage, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

Customer.hasOne(CustomerInfo, { foreignKey: 'customer_id' });
CustomerInfo.belongsTo(Customer, { foreignKey: 'customer_id' });


ProductItem.hasMany(ProductImage, { foreignKey: 'product_item_id' });
ProductImage.belongsTo(ProductItem, { foreignKey: 'product_item_id' });
// Category & Product
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// Product & Wishlist
Product.hasMany(Wishlist, { foreignKey: 'product_id' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id' });

// Product & Review
Product.hasMany(Review, { foreignKey: 'product_id' });
Review.belongsTo(Product, { foreignKey: 'product_id' });

// Product & Tag (Many-to-Many)
Product.belongsToMany(Tag, { through: ProductTag, foreignKey: 'product_id' });
Tag.belongsToMany(Product, { through: ProductTag, foreignKey: 'tag_id' });

// Product & Discount (Many-to-Many)
Product.belongsToMany(Discount, { through: DiscountProduct, foreignKey: 'product_id' });
Discount.belongsToMany(Product, { through: DiscountProduct, foreignKey: 'discount_id' });

// Category & Discount (Many-to-Many)
Category.belongsToMany(Discount, { through: DiscountCategory, foreignKey: 'category_id' });
Discount.belongsToMany(Category, { through: DiscountCategory, foreignKey: 'discount_id' });

// Customer & Address
Customer.hasMany(Address, { foreignKey: 'customer_id' });
Address.belongsTo(Customer, { foreignKey: 'customer_id' });

// Customer & Wishlist
Customer.hasMany(Wishlist, { foreignKey: 'customer_id' });
Wishlist.belongsTo(Customer, { foreignKey: 'customer_id' });

// Customer & Review
Customer.hasMany(Review, { foreignKey: 'customer_id' });
Review.belongsTo(Customer, { foreignKey: 'customer_id' });

// Review & ReviewImage
Review.hasMany(ReviewImage, { foreignKey: 'review_id' });
ReviewImage.belongsTo(Review, { foreignKey: 'review_id' });

// Customer & Cart
Customer.hasOne(Cart, { foreignKey: 'customer_id' });
Cart.belongsTo(Customer, { foreignKey: 'customer_id' });

// Cart & CartItem
Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

// CartItem & ProductItem
CartItem.belongsTo(ProductItem, { foreignKey: 'product_item_id' });
ProductItem.hasMany(CartItem, { foreignKey: 'product_item_id' });

// ProductItem & Inventory
ProductItem.hasOne(Inventory, { foreignKey: 'product_item_id' });
Inventory.belongsTo(ProductItem, { foreignKey: 'product_item_id' });

// Inventory & InventoryHistory
Inventory.hasMany(InventoryHistory, { foreignKey: 'inventory_id' });
InventoryHistory.belongsTo(Inventory, { foreignKey: 'inventory_id' });

// Customer & Orders
Customer.hasMany(Orders, { foreignKey: 'customer_id' });
Orders.belongsTo(Customer, { foreignKey: 'customer_id' });

// Orders & OrderItem
Orders.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Orders, { foreignKey: 'order_id' });

// OrderItem & ProductItem
OrderItem.belongsTo(ProductItem, { foreignKey: 'product_item_id' });
ProductItem.hasMany(OrderItem, { foreignKey: 'product_item_id' });

// Orders & OrderTracking
Orders.hasMany(OrderTracking, { foreignKey: 'order_id' });
OrderTracking.belongsTo(Orders, { foreignKey: 'order_id' });

// Orders & Transaction
Orders.hasMany(Transaction, { foreignKey: 'order_id' });
Transaction.belongsTo(Orders, { foreignKey: 'order_id' });

// Orders & Shipping
Orders.hasOne(Shipping, { foreignKey: 'order_id' });
Shipping.belongsTo(Orders, { foreignKey: 'order_id' });

// Customer & ShippingAddress
Customer.hasMany(ShippingAddress, { foreignKey: 'customer_id' });
ShippingAddress.belongsTo(Customer, { foreignKey: 'customer_id' });

// Customer & CustomerPaymentMethod
Customer.hasMany(CustomerPaymentMethod, { foreignKey: 'customer_id' });
CustomerPaymentMethod.belongsTo(Customer, { foreignKey: 'customer_id' });

// CustomerPaymentMethod & các phương thức thanh toán
CustomerPaymentMethod.hasOne(BankTransferInfo, { foreignKey: 'payment_method_id' });
BankTransferInfo.belongsTo(CustomerPaymentMethod, { foreignKey: 'payment_method_id' });

CustomerPaymentMethod.hasOne(CreditCardInfo, { foreignKey: 'payment_method_id' });
CreditCardInfo.belongsTo(CustomerPaymentMethod, { foreignKey: 'payment_method_id' });

CustomerPaymentMethod.hasOne(PayPalInfo, { foreignKey: 'payment_method_id' });
PayPalInfo.belongsTo(CustomerPaymentMethod, { foreignKey: 'payment_method_id' });

// Blog & các mối quan hệ
BlogCategory.hasMany(BlogCategoryRelation, { foreignKey: 'category_id' });
BlogCategoryRelation.belongsTo(BlogCategory, { foreignKey: 'category_id' });

Blog.hasMany(BlogCategoryRelation, { foreignKey: 'blog_id' });
BlogCategoryRelation.belongsTo(Blog, { foreignKey: 'blog_id' });

Blog.hasMany(BlogTag, { foreignKey: 'blog_id' });
BlogTag.belongsTo(Blog, { foreignKey: 'blog_id' });

// Employee & Role
Role.hasMany(Employee, { foreignKey: 'role_id' });
Employee.belongsTo(Role, { foreignKey: 'role_id' });

// Customer & Notification
Customer.hasMany(Notification, { foreignKey: 'customer_id' });
Notification.belongsTo(Customer, { foreignKey: 'customer_id' });

// Discount & DiscountUsage
Discount.hasMany(DiscountUsage, { foreignKey: 'discount_id' });
DiscountUsage.belongsTo(Discount, { foreignKey: 'discount_id' });

Customer.hasMany(DiscountUsage, { foreignKey: 'customer_id' });
DiscountUsage.belongsTo(Customer, { foreignKey: 'customer_id' });

Orders.hasOne(ShippingAddress, { foreignKey: 'order_id' });
ShippingAddress.belongsTo(Orders, { foreignKey: 'order_id' });


// Product.js
Product.hasMany(OrderItem, { foreignKey: 'productId' });

// OrderItem.js
OrderItem.belongsTo(Product, { foreignKey: 'productId' });




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
