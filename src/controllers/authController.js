import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Customer from "../models/Customer.js";
import CustomerInfo from "../models/CustomerInfo.js";
import Wishlist from "../models/Wishlist.js";
import CartItem from "../models/CartItem.js";
import Cart from "../models/Cart.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_EXPIRES_IN = "7d";
const CLIENT_URL = process.env.CLIENT_URL;
const EMAIL_USER = process.env.EMAIL_USER;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const register = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
  }
  if (fullname.length < 3) {
    return res.status(400).json({ message: "Họ và tên phải có ít nhất 3 ký tự." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Email không hợp lệ." });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({ message: "Mật khẩu phải ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt." });
  }

  const existingCustomer = await Customer.findOne({ where: { email } });
  if (existingCustomer) {
    return res.status(400).json({ message: "Email đã được sử dụng." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const customer = await Customer.create({ email, password: hashedPassword });

  await CustomerInfo.create({ customerId: customer.id, fullname });

  res.status(201).json({ message: "Đăng ký thành công!", customerId: customer.id });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu." });
  }

  const customer = await Customer.findOne({ where: { email } });
  if (!customer) {
    return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
  }

  const isMatch = await bcrypt.compare(password, customer.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
  }

  const [customerInfo, likedProducts, cart] = await Promise.all([
    CustomerInfo.findOne({ where: { customerId: customer.id } }),
    Wishlist.findAll({ where: { customerId: customer.id }, attributes: ["productId"] }),
    Cart.findOne({ where: { customerId: customer.id } }),
  ]);

  const cartItems = cart
    ? await CartItem.findAll({ where: { cartId: cart.id }, attributes: ["productId", "quantity"] })
    : [];

  const token = jwt.sign({ id: customer.id, email: customer.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.json({
    message: "Đăng nhập thành công!",
    token,
    user: {
      id: customer.id,
      email: customer.email,
      fullname: customerInfo?.fullname || "",
      avatar: customerInfo?.avatar || "",
      phone: customerInfo?.phone || "",
    },
    likedProducts: likedProducts.map((item) => item.productId),
    cart: cartItems,
  });
};

const socialLogin = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Thiếu thông tin email hoặc tên." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Email không hợp lệ." });
  }

  let customer = await Customer.findOne({ where: { email } });
  if (!customer) {
    customer = await Customer.create({ email, name, password: null });
  }

  const token = jwt.sign({ id: customer.id, email: customer.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.json({ message: "Đăng nhập MXH thành công!", token, customer });
};

const customerForgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Vui lòng nhập email." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Email không hợp lệ." });
  }

  const customer = await Customer.findOne({ where: { email } });
  if (!customer) {
    return res.status(404).json({ message: "Email không tồn tại." });
  }

  const resetToken = jwt.sign({ id: customer.id, email: customer.email }, JWT_SECRET, {
    expiresIn: "15m",
  });

  const resetLink = `${CLIENT_URL}/reset-password?token=${resetToken}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <div style="text-align: center;">
        <img src="https://yourcompany.com/logo.png" alt="Company Logo" width="120" />
      </div>
      <h2 style="color: #333;">Yêu cầu đặt lại mật khẩu</h2>
      <p>Xin chào <strong>${customer.email}</strong>,</p>
      <p>Bạn vừa yêu cầu đặt lại mật khẩu. Nhấn vào nút bên dưới để tiếp tục:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-size: 16px;">Đặt lại mật khẩu</a>
      </div>
      <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      <p style="color: #888;">Liên hệ hỗ trợ: support@yourcompany.com</p>
      <hr style="border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; text-align: center; color: #888;">© 2024 Your Company. All rights reserved.</p>
    </div>
  `;

  const textContent = `Xin chào ${customer.email},

  Bạn vừa yêu cầu đặt lại mật khẩu. Hãy nhấn vào link sau để tiếp tục:

  ${resetLink}

  Nếu bạn không yêu cầu, vui lòng bỏ qua email này.

  Trân trọng,
  Your Company`;

  await transporter.sendMail({
    from: `"Your Company" <${EMAIL_USER}>`,
    to: email,
    subject: "Đặt lại mật khẩu",
    text: textContent,
    html: htmlContent,
  });

  res.json({ message: "Email đặt lại mật khẩu đã được gửi!" });
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Thiếu token hoặc mật khẩu mới." });
  }
  if (!isValidPassword(newPassword)) {
    return res.status(400).json({ message: "Mật khẩu phải ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const customer = await Customer.findByPk(decoded.id);
    if (!customer) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    customer.password = hashedPassword;
    await customer.save();

    res.json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Token không hợp lệ hoặc đã hết hạn.", error: error.message });
  }
};
export default { register, resetPassword, customerForgotPassword, login, socialLogin }