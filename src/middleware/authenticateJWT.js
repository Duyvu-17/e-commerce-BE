import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header

  if (!token) {
    return res.status(401).json({ message: "Không có token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token không hợp lệ" });
    }
    req.user = user; // Lưu thông tin user vào req
    next();
  });
};

export default authenticateJWT;
