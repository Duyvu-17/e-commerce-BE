import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Customer from "../models/Customer.js";
import CustomerInfo from "../models/CustomerInfo.js";
import Wishlist from "../models/Wishlist.js";
import CartItem from "../models/CartItem.js";
import Cart from "../models/Cart.js";
import PasswordReset from "../models/PasswordReset.js";
import Op from "../config/database.js";
import sequelize from "../config/database.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
console.log(JWT_EXPIRES_IN);

const CLIENT_URL = process.env.CLIENT_URL;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const validateEnvVariables = () => {
  const requiredVars = [
    { name: 'JWT_SECRET', value: JWT_SECRET },
    { name: 'CLIENT_URL', value: CLIENT_URL },
    { name: 'EMAIL_USER', value: EMAIL_USER },
    { name: 'EMAIL_PASS', value: EMAIL_PASS }
  ];

  const missingVars = requiredVars.filter(v => !v.value);

  if (missingVars.length > 0) {
    console.error("Missing necessary environment variables:",
      missingVars.map(v => v.name).join(', '));
    process.exit(1);
  }
};

validateEnvVariables();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  },
});

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password) => {
  const hasLowercase = /(?=.*[a-z])/.test(password);
  const hasUppercase = /(?=.*[A-Z])/.test(password);
  const hasNumber = /(?=.*\d)/.test(password);
  const hasSpecialChar = /(?=.*[@$!%*?&])/.test(password);
  const isLongEnough = password.length >= 8;
  return hasLowercase &&
    hasUppercase &&
    hasNumber &&
    hasSpecialChar &&
    isLongEnough;
};
const register = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {

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
      return res.status(400).json({
        message: "Mật khẩu phải ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      });
    }

    // Check for existing customer
    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email đã được sử dụng." });
    }

    // Create customer
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      email,
      password: hashedPassword
    });

    // Create customer info
    await CustomerInfo.create({
      customerId: customer.id,
      fullname
    });

    res.status(201).json({
      message: "Đăng ký thành công!",
      customerId: customer.id
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Đã có lỗi xảy ra. Vui lòng thử lại." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
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
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Đã có lỗi xảy ra. Vui lòng thử lại." });
  }
};

const socialLogin = async (req, res) => {
  const { email, name } = req.body;

  try {
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
  } catch (error) {
    console.error("Error during social login:", error);
    res.status(500).json({ message: "Đã có lỗi xảy ra. Vui lòng thử lại." });
  }
};

const generateResetPasswordEmail = (customer, resetLink) => {
  return {
    html: `
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
      </div>`,
    text: `Xin chào ${customer.email},

Bạn vừa yêu cầu đặt lại mật khẩu. Hãy nhấn vào link sau để tiếp tục:

${resetLink}

Nếu bạn không yêu cầu, vui lòng bỏ qua email này.

Trân trọng,
Store-X`
  };
};

const customerForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Input validation
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

    // Generate reset token
    const resetToken = jwt.sign(
      { id: customer.id, email: customer.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `${CLIENT_URL}/reset-password?token=${resetToken}`;
    const { html, text } = generateResetPasswordEmail(customer, resetLink);
    console.log(resetToken);

    // Send reset password email
    await transporter.sendMail({
      from: `"Your Company" <${EMAIL_USER}>`,
      to: email,
      subject: "Đặt lại mật khẩu",
      text,
      html,
    });

    res.json({ message: "Email đặt lại mật khẩu đã được gửi!" });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res.status(500).json({ message: "Đã có lỗi xảy ra. Vui lòng thử lại." });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Thiếu token hoặc mật khẩu mới." });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ message: "Mật khẩu phải ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt." });
    }

    // Giải mã và xác thực token
    const decoded = jwt.verify(token, JWT_SECRET);
    const customer = await Customer.findByPk(decoded.id);
    if (!customer) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    // Kiểm tra xem token đã được sử dụng chưa
    const existingReset = await PasswordReset.findOne({
      where: {
        customerId: customer.id,
        token: token,
        usedAt: null  // Chỉ chấp nhận token chưa được sử dụng
      }
    });

    if (!existingReset) {
      return res.status(400).json({ 
        message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã được sử dụng." 
      });
    }

    // Kiểm tra token còn hiệu lực không
    if (existingReset.expiresAt < new Date()) {
      return res.status(400).json({ 
        message: "Liên kết đặt lại mật khẩu đã hết hạn." 
      });
    }

    // Kiểm tra số lần reset mật khẩu trong 24 giờ
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const resetAttempts = await PasswordReset.count({
      where: {
        customerId: customer.id,
        createdAt: { [Op.gte]: oneDayAgo },
        type: 'password_reset'
      }
    });
    if (resetAttempts >= 3) {
      return res.status(429).json({
        message: "Bạn đã vượt quá số lần reset mật khẩu. Vui lòng thử lại sau 24 giờ."
      });
    }

    // Kiểm tra mật khẩu mới không được trùng với mật khẩu cũ
    const isOldPassword = await bcrypt.compare(newPassword, customer.password);
    if (isOldPassword) {
      return res.status(400).json({
        message: "Mật khẩu mới không được trùng với mật khẩu cũ."
      });
    }

    // Sử dụng transaction để đảm bảo tính toàn vẹn
    await sequelize.transaction(async (t) => {
      // Hash mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await customer.update({
        password: hashedPassword,
        lastPasswordResetAt: new Date()
      }, { transaction: t });

      // Đánh dấu token đã được sử dụng
      await existingReset.update({
        usedAt: new Date()
      }, { transaction: t });
    });

    // Gửi email thông báo
    await transporter.sendMail({
      from: `"Your Company" <${EMAIL_USER}>`,
      to: customer.email,
      subject: "Mật khẩu của bạn đã được thay đổi",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px;">
          <h2>Thay đổi mật khẩu</h2>
          <p>Mật khẩu tài khoản của bạn vừa được thay đổi vào ${new Date().toLocaleString()}.</p>
          <p>Nếu đây không phải là bạn, vui lòng liên hệ hỗ trợ ngay.</p>
          <p>Thông tin liên hệ hỗ trợ:</p>
          <ul>
           <li>Email hỗ trợ: <a href="mailto:${EMAIL_USER}">${EMAIL_USER}</a></li>
            <li>Số điện thoại hỗ trợ: <a href="tel:+1234567890">+123 456 7890</a></li>
          </ul>
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        </div>
      `
    });

    res.json({
      message: "Đặt lại mật khẩu thành công!",
      attemptsRemaining: 2 - resetAttempts
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: "Liên kết đặt lại mật khẩu đã hết hạn." });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: "Liên kết đặt lại mật khẩu không hợp lệ." });
    }

    res.status(500).json({ message: "Đã có lỗi xảy ra. Vui lòng thử lại." });
  }
};

export default {
  register,
  resetPassword,
  customerForgotPassword,
  login,
  socialLogin
};