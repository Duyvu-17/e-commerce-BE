const Settings = require("../../models/Settings");

// 📌 Lấy danh sách cài đặt
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findAll();
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Lỗi server khi lấy cài đặt" });
  }
};

// 📌 Cập nhật cài đặt
exports.updateSettings = async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ message: "Thiếu thông tin cài đặt" });
    }

    let setting = await Settings.findOne({ where: { key } });

    if (setting) {
      await setting.update({ value });
    } else {
      setting = await Settings.create({ key, value });
    }

    res.status(200).json({ message: "Cập nhật cài đặt thành công", setting });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật cài đặt" });
  }
};
