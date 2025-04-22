import ChatMessage from '../models/ChatMessage.js';
import Customer from '../models/Customer.js';
import CustomerInfo from '../models/CustomerInfo.js';
import ChatConversation from './../models/ChatConversation.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const chatSocketHandler = (io) => {
  io.on('connection', (socket) => {
    // Gửi danh sách conversation cho nhân viên khi kết nối
    socket.on('getConversations', async () => {
      try {
        const conversations = await ChatConversation.findAll({
          include: [
            {
              model: Customer,
              include: [
                {
                  model: CustomerInfo,
                  attributes: [
                    "fullname", "first_name", "last_name", "avatar", "address",
                    "phone_number", "birth_date"
                  ],
                  required: false,
                }
              ]
            }
          ],
          order: [['updated_at', 'DESC']],
        });

        const enhancedConversations = await Promise.all(
          conversations.map(async (conversation) => {
            const lastMessage = await ChatMessage.findOne({
              where: { conversation_id: conversation.id },
              order: [['timestamp', 'DESC']],
            });

            const unreadCount = await ChatMessage.count({
              where: {
                conversation_id: conversation.id,
                isRead: false,
                sender_id: 'customer',
              },
            });

            const customer = conversation.Customer;
            const customerInfo = customer?.CustomerInfo;

            return {
              id: conversation.id,
              customerId: conversation.customer_id,
              status: conversation.status,
              last_message: lastMessage?.content || '',
              last_message_time: lastMessage?.timestamp || conversation.updated_at,
              unreadCount,
              Customer: {
                email: customer?.email || '',
                status: customer?.status || 'unknown',
                info: customerInfo ? {
                  fullname: customerInfo.fullname,
                  first_name: customerInfo.first_name,
                  last_name: customerInfo.last_name,
                  avatar: customerInfo.avatar,
                  address: customerInfo.address,
                  phone_number: customerInfo.phone_number,
                  birth_date: customerInfo.birth_date,
                } : null
              },
            };
          })
        );

        socket.emit('conversationList', enhancedConversations);

      } catch (err) {
        console.error('❌ Error fetching enhanced conversations:', err);
        socket.emit('conversationList', []); 
      }
    });

    socket.on('getMessages', async ({ conversationId }) => {
      try {
        const messages = await ChatMessage.findAll({
         where: { conversation_id: conversationId },
          order: [['timestamp', 'ASC']],
        });
        socket.emit('messageList', messages);
      } catch (err) {
        console.error('❌ Error fetching messages:', err);
      }
    });

    socket.on('sendMessage', async ({ conversationId, message }) => {   
      try {
        const mappedMessage = {
          id: message.id,
          conversation_id: conversationId,
          sender_id: message.senderId,
          content: message.content,
          timestamp: message.timestamp,
          isStaff: message.isStaff,
          sender_type: message.sender_type,
          attachments: message.attachments
        };
        
        const savedMessage = await ChatMessage.create(mappedMessage);
    
        await ChatConversation.update(
          { updated_at: new Date() },
          { where: { id: conversationId } }
        );
    
        io.emit('newMessage', savedMessage);
      } catch (err) {
        console.error('❌ Error saving message:', err);
      }
    });

    // Đóng hoặc mở lại conversation
    socket.on('updateConversationStatus', async ({ conversationId, status }) => {
      try {
        await ChatConversation.update(
          { status },
          { where: { id: conversationId } }
        );

        const updated = await ChatConversation.findByPk(conversationId);
        io.emit('conversationUpdated', updated);
      } catch (err) {
        console.error('❌ Error updating conversation status:', err);
      }
    });

    // Tải ảnh lên
    socket.on('uploadImage', ({ fileName, fileType, data }) => {
      try {
        const buffer = Buffer.from(data);
        // Chỉnh sửa lại đường dẫn tới file
        const filePath = path.join(__dirname, '../../uploads/chat', fileName); 

        fs.writeFile(filePath, buffer, (err) => {
          if (err) {
            console.error('❌ Lỗi lưu ảnh:', err);
            socket.emit('uploadError', { message: 'Lỗi khi lưu ảnh!' });
          } else {
            console.log('✅ Ảnh lưu thành công:', fileName);
            socket.emit('uploadSuccess', {
              url: `/uploads/chat/${fileName}`, 
            });
          }
        });
      } catch (err) {
        console.error('❌ Lỗi không xác định:', err);
        socket.emit('uploadError', { message: 'Upload thất bại' });
      }
    });

    socket.on('disconnect', () => {
      console.log('📤 Client disconnected:', socket.id);
    });
  });
};

export default chatSocketHandler;
