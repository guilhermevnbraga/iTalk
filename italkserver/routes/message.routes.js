import express from "express";
import {
    getMessages,
    sendMessage,
    getLastMessage,
} from "../controllers/messageController";

const messageRouter = express.Router();

messageRouter.get("/chat", getMessages);
messageRouter.get("last", getLastMessage);
messageRouter.post("send", sendMessage);

export default messageRouter;
