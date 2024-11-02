import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getMessages(req, res) {
    try {
        const { senderName, receiverName } = req.query;

        const sender = await prisma.user.findUnique({
            where: { username: senderName },
        });
        const receiver = await prisma.user.findUnique({
            where: { username: receiverName },
        });

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: sender.id, receiverId: receiver.id },
                    { senderId: receiver.id, receiverId: sender.id },
                ],
            },
            orderBy: { date: "asc" },
        });

        const newMessages = messages.map((message) => {
            if (message.date) {
                message.date = message.date.toString();
            }
            return message;
        });

        res.status(200).json({ messages: newMessages });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function sendMessage(req, res) {
    try {
        const { senderName, receiverName, content } = req.body;

        const sender = await prisma.user.findUnique({
            where: { username: senderName },
        });
        const receiver = await prisma.user.findUnique({
            where: { username: receiverName },
        });

        await prisma.message.create({
            data: {
                senderId: sender.id,
                receiverId: receiver.id,
                content,
                date: Date.now(),
            },
        });

        res.status(200).json({ message: "Message sent successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function getLastMessage(req, res) {
    try {
        const { senderName, receiverName } = req.query;

        const sender = await prisma.user.findUnique({
            where: { username: senderName },
        });

        const receiver = await prisma.user.findUnique({
            where: { username: receiverName },
        });

        const lastMessage = await prisma.message.findFirst({
            where: {
                OR: [
                    { senderId: sender.id, receiverId: receiver.id },
                    { senderId: receiver.id, receiverId: sender.id },
                ],
            },
            orderBy: { date: "desc" },
            take: 1,
        });

        if (lastMessage && typeof lastMessage.date === "bigint") {
            lastMessage.date = lastMessage.date.toString();
        }

        if (lastMessage.senderId === sender.id) {
            lastMessage.senderName = "You";
            lastMessage.receiverName = receiver.name;
        } else {
            lastMessage.senderName = receiver.name;
            lastMessage.receiverName = "You";
        }

        lastMessage.receiverId = receiver.id;

        res.status(200).json({ lastMessage });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
