import db from '../../models/index.js';
const { ChatConversation, ChatMessage, Customer, Employee, CustomerInfo } = db;

// 1. Tạo hoặc lấy conversation giữa customer và nhân viên
export const startConversation = async (req, res) => {
  const { customer_id } = req.body;

  try {
    let conversation = await ChatConversation.findOne({
      where: { customer_id, status: 'active' },
    });

    if (!conversation) {
      conversation = await ChatConversation.create({ customer_id });
    }

    return res.status(200).json(conversation);
  } catch (err) {
    console.error('startConversation error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 2. Gửi tin nhắn
export const sendMessage = async (req, res) => {
  const { conversation_id, sender_type, sender_id, content, attachments } = req.body;

  try {
    const message = await ChatMessage.create({
      conversation_id,
      sender_type,
      sender_id,
      content,
      attachments,
    });

    // Update thông tin cuộc trò chuyện
    await ChatConversation.update(
      {
        last_message: content,
        last_message_time: new Date(),
      },
      { where: { id: conversation_id } }
    );

    return res.status(200).json(message);
  } catch (err) {
    console.error('sendMessage error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 3. Lấy danh sách cuộc trò chuyện (cho employee)
export const getAllConversations = async (req, res) => {
  try {
    const conversations = await ChatConversation.findAll({
      include: [
        {
          model: Customer,
          include: [{ model: CustomerInfo }],
        },
      ],
      order: [['last_message_time', 'DESC']],
    });

    return res.status(200).json(conversations);
  } catch (err) {
    console.error('getAllConversations error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 4. Lấy tin nhắn của một cuộc trò chuyện
export const getMessagesByConversation = async (req, res) => {
  const { conversation_id } = req.params;

  try {
    const messages = await ChatMessage.findAll({
      where: { conversation_id },
      order: [['timestamp', 'ASC']],
    });

    return res.status(200).json(messages);
  } catch (err) {
    console.error('getMessages error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const closeConversation = async (req, res) => {
  const { conversation_id } = req.params;

  try {
    await ChatConversation.update(
      { status: 'closed' },
      { where: { id: conversation_id } }
    );

    return res.status(200).json({ message: 'Conversation closed' });
  } catch (err) {
    console.error('closeConversation error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
