import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Employee from "../../models/Employee.js";
// import Role from './../../models/Role';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// const getRoleNameFromId = async (role_id) => {
//   const role = await Role.findOne({ where: { id: role_id } });
//   return role?.name; // ví dụ: "Admin"
// };
// Hàm tạo access token
const generateToken = (employee) => {
  console.log(employee);
  
  return jwt.sign(
    { id: employee.id, email: employee.email, role: employee.name },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Hàm tạo refresh token với thời hạn dài hơn
const generateRefreshToken = (employee) => {
  return jwt.sign(
    { id: employee.id },
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET + "_refresh",
    { expiresIn: JWT_EXPIRES_IN }
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
    console.log(password);

    // Kiểm tra xem email và mật khẩu có được nhập không
    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu!" });
    }

    // Kiểm tra định dạng email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ!" });
    }

    // Tìm kiếm người dùng trong cơ sở dữ liệu
    const employee = await Employee.findOne({ where: { email }, raw: true });

    // Kiểm tra nếu không tìm thấy người dùng
    if (!employee) {
      return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    }

    console.log(employee.password);  // Kiểm tra password nếu employee không phải null

    // Kiểm tra nếu tài khoản bị vô hiệu hóa
    if (employee.status !== "active") {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị vô hiệu hóa!" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không chính xác!" });
    }

    // Tạo token và refresh token cho người dùng
    const token = generateToken(employee);
    const refreshToken = generateRefreshToken(employee);

    // Lưu refresh token vào cơ sở dữ liệu (có thể thêm bảng RefreshToken hoặc thêm cột vào Employee)
    await Employee.update(
      { refreshToken: refreshToken },
      { where: { id: employee.id } }
    );

    res.json({
      message: "Đăng nhập thành công!",
      token,
      refreshToken,
      user: {
        id: employee.id,
        name: employee.full_name,
        email: employee.email,
        role: employee.role,
        avatar: employee.avatar
      },
    });

  } catch (error) {
    // Bắt và xử lý lỗi
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// Làm mới token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Kiểm tra xem refresh token có được cung cấp không
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token không được cung cấp!" });
    }

    // Xác thực refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET + "_refresh",
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Refresh token không hợp lệ hoặc đã hết hạn!" });
        }

        try {
          // Tìm kiếm người dùng bằng id từ token và kiểm tra refresh token
          const employee = await Employee.findOne({
            where: {
              id: decoded.id,
              refreshToken: refreshToken
            }
          });

          if (!employee) {
            return res.status(403).json({ message: "Refresh token không tồn tại trong hệ thống!" });
          }

          // Tạo access token mới
          const newToken = generateToken(employee);
          // Tạo refresh token mới (tùy chọn)
          const newRefreshToken = generateRefreshToken(employee);

          // Cập nhật refresh token mới vào cơ sở dữ liệu
          await Employee.update(
            { refreshToken: newRefreshToken },
            { where: { id: employee.id } }
          );

          // Trả về access token mới và refresh token mới
          res.json({
            message: "Làm mới token thành công!",
            token: newToken,
            refreshToken: newRefreshToken
          });

        } catch (error) {
          res.status(500).json({ message: "Lỗi server!", error: error.message });
        }
      }
    );
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
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await Employee.update(
        { refreshToken: null },
        { where: { refreshToken } }
      );
    }

    res.json({ message: "Đăng xuất thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

const authController = {
  register, login, verifyToken, logout, refreshToken
};

export default authController;