import sequelize from '../config/database.js';
import Customer from '../models/Customer.js';
import Employee from '../models/Employee.js';
import ChatConversation from '../models/ChatConversation.js';
import ChatMessage from '../models/ChatMessage.js';
import { v4 as uuidv4 } from 'uuid'; // Thêm thư viện uuid để tạo ID

const sampleMessages = [
  "Xin chào, tôi cần giúp đỡ!",
  "Đơn hàng của tôi bị lỗi, bạn kiểm tra giúp được không?",
  "Tôi muốn huỷ đơn hàng.",
  "Sản phẩm này còn hàng không?",
  "Cảm ơn bạn đã hỗ trợ!",
];

const replyMessages = [
  "Chào bạn, tôi có thể giúp gì?",
  "Tôi đang kiểm tra đơn hàng, vui lòng chờ một chút.",
  "Bạn muốn đổi sang sản phẩm nào?",
  "Sản phẩm vẫn còn hàng ạ!",
  "Rất vui khi được hỗ trợ bạn!",
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seedChatData() {
  try {
    await sequelize.sync();

    const customers = await Customer.findAll();
    const employees = await Employee.findAll();

    if (!customers.length || !employees.length) {
      throw new Error("⚠️ Không tìm thấy dữ liệu Customer hoặc Employee.");
    }

    for (const customer of customers) {
      const employee = getRandomItem(employees);

      const conversation = await ChatConversation.create({
        customer_id: customer.id,
        status: 'active',
        last_message: 'Cảm ơn bạn đã hỗ trợ!',
        last_message_time: new Date(),
      });

      const createdAt = new Date(Date.now() - 1000 * 60 * 10); 

      const messages = [
        {
          id: uuidv4(), 
          conversation_id: conversation.id,
          sender_type: 'customer',
          sender_id: customer.id,
          content: getRandomItem(sampleMessages),
          timestamp: new Date(createdAt.getTime() + 1000 * 60 * 1),
        },
        {
          id: uuidv4(), // Tạo UUID cho mỗi message
          conversation_id: conversation.id,
          sender_type: 'employee',
          sender_id: employee.id,
          content: getRandomItem(replyMessages),
          timestamp: new Date(createdAt.getTime() + 1000 * 60 * 2),
        },
        {
          id: uuidv4(), // Tạo UUID cho mỗi message
          conversation_id: conversation.id,
          sender_type: 'customer',
          sender_id: customer.id,
          content: getRandomItem(sampleMessages),
          timestamp: new Date(createdAt.getTime() + 1000 * 60 * 3),
        },
        {
          id: uuidv4(), // Tạo UUID cho mỗi message
          conversation_id: conversation.id,
          sender_type: 'employee',
          sender_id: employee.id,
          content: getRandomItem(replyMessages),
          timestamp: new Date(createdAt.getTime() + 1000 * 60 * 4),
        },
      ];

      await ChatMessage.bulkCreate(messages);

      await conversation.update({
        last_message: messages[messages.length - 1].content,
        last_message_time: messages[messages.length - 1].timestamp,
      });

      console.log(`✅ Created conversation for customer_id=${customer.id} with employee_id=${employee.id}`);
    }

    console.log("🎉 Đã seed dữ liệu chat thành công.");
  } catch (err) {
    console.error("❌ Lỗi khi seeding chat:", err);
  } finally {
    await sequelize.close();
  }
}

seedChatData();