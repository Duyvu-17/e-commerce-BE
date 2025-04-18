import Employee from "../../models/Employee.js";
import Role from "../../models/Role.js";

// Lấy danh sách tất cả nhân viên
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      attributes: ["id", "full_name", "email", "status", "avatar"],
      include: [
        {
          model: Role,
          attributes: ["id", "name"],
        },
      ],
    });
    res.status(200).json(
      employees.map((employee) => {
        const e = employee.toJSON();
        e.role = e.Role;
        delete e.Role;
        return e;
      })
    );

  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhân viên:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách nhân viên" });
  }
};

// Lấy chi tiết 1 nhân viên theo ID
const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id, {
      attributes: ["id", "full_name", "email", "status", "avatar"],
      include: [
        {
          model: Role,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!employee) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }
    const e = employee.toJSON();
    e.role = e.Role;
    delete e.Role;
    res.status(200).json(e);
    res.status(200).json(employee);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết nhân viên:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tạo mới nhân viên
const createEmployee = async (req, res) => {
  const { email, full_name, password, avatar, role_id, status } = req.body;

  try {
    const existing = await Employee.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const newEmployee = await Employee.create({
      email,
      full_name,
      password, // Lưu ý: cần mã hóa mật khẩu nếu dùng trong thực tế
      avatar,
      role_id,
      status: status || "active",
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Lỗi khi tạo nhân viên:", error);
    res.status(500).json({ message: "Lỗi server khi tạo nhân viên" });
  }
};

// Cập nhật thông tin nhân viên
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { full_name, email, password, avatar, role_id, status } = req.body;

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    await employee.update({
      full_name,
      email,
      password, // Nếu không thay đổi thì không nên gửi lên
      avatar,
      role_id,
      status,
    });

    res.status(200).json(employee);
  } catch (error) {
    console.error("Lỗi khi cập nhật nhân viên:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật nhân viên" });
  }
};

// Xóa nhân viên
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    await employee.destroy();
    res.status(200).json({ message: "Xóa nhân viên thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa nhân viên:", error);
    res.status(500).json({ message: "Lỗi server khi xóa nhân viên" });
  }
};

const employeeController = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

export default employeeController;
