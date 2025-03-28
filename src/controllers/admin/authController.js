import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Employee from "../../models/Employee.js";


const generateToken = (employee) => {
  return jwt.sign(
    { id: employee.id, email: employee.email, role: employee.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const register = async (req, res) => {
  console.log(req.body); // Để kiểm tra dữ liệu trong request
  try {
    const { fullName, email, password, role } = req.body;

    // Kiểm tra thông tin yêu cầu
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu!" });
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ!" });
    }

    // Kiểm tra mật khẩu
    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
    }

    // Kiểm tra vai trò
    const validRoles = ["admin", "super-admin"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: "Vai trò không hợp lệ!" });
    }

    // Kiểm tra email đã tồn tại
    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo mới nhân viên
    const newEmployee = await Employee.create({
      fullName, 
      password: hashedPassword,
      email,
      role: role || "admin", 
    });

    // Trả về phản hồi thành công
    res.status(201).json({
      message: "Tạo tài khoản thành công!",
      employee: {
        id: newEmployee.id,
        fullName: newEmployee.fullName,
        email: newEmployee.email,
        role: newEmployee.role,
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};


const login = async (req, res) => {
  console.log(req.body);
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu!" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ!" });
    }

    const employee = await Employee.findOne({ where: { email }, raw: true });
    console.log(employee.password);

    if (!employee) {
      return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    }

    if (employee.status !== "active") {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị vô hiệu hóa!" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không chính xác!" });
    }

    const token = generateToken(employee);
    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: employee.id,
        email: employee.email,
        role: employee.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};


// Xác thực Employee
const verifyToken = async (req, res) => {
  try {
    if (!req.employee || !req.employee.id) {
      return res.status(401).json({ message: "Không có token hợp lệ!" });
    }
    const employee = await Employee.findByPk(req.employee.id, {
      attributes: ["id", "email", "role"],
    });
    if (!employee) {
      return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    }

    res.json({
      message: "Xác thực thành công!",
      employee
    });

  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};


// Đăng xuất
const logout = (req, res) => {
  res.json({ message: "Đăng xuất thành công!" });
};
const authController = {
  register, login, verifyToken, logout
};

export default authController;

