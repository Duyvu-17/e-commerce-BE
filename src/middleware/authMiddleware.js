import jwt from "jsonwebtoken";


const adminMiddleware = (req, res, next) => {
  if (!req.employee) {
    return res.status(401).json({ message: "Chưa xác thực người dùng!" });
  }
  const role = req.employee.role;
  if (role !== 1 && role !== 2 && role !== 3) {
    return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
  }
  next();
};

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Không có token, từ chối truy cập!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.employee = decoded;

    
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ!" });
  }
};


const Middleware = {
  authMiddleware, adminMiddleware
};
export default Middleware;
