import express from "express";
import { closeConversation, getAllConversations, getMessagesByConversation, sendMessage, startConversation } from "../../controllers/admin/chatController.js";


const router = express.Router();

router.post("/chat/start", startConversation);
router.post("/chat/send", sendMessage);
router.get("/chat/conversations", getAllConversations);
router.get("/chat/messages/:conversation_id", getMessagesByConversation);
router.put("/chat/close/:conversation_id", closeConversation);

export default router;
