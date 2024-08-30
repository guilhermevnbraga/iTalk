const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();
const app = express();

const allowedOrigins = [
    "https://italk-zeta.vercel.app",
    "http://localhost:3000",
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://italk-zeta.vercel.app');
    next();
  });

app.use(express.json());

const storage = multer.memoryStorage();
const limits = { fileSize: 1024 * 1024 * 5 };
const upload = multer({ storage, limits });

app.post("/register", async (req, res) => {
    const { userName, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        let newUserName = userName.replace(/\s+/g, "").toLowerCase();

        const userNameExists = await prisma.user.findMany({
            where: { username: { contains: newUserName } },
        });

        if (userNameExists.length > 0) {
            newUserName = `${newUserName}${userNameExists.length + 1}`;
        }

        await prisma.user.create({
            data: {
                name: userName,
                username: newUserName,
                email,
                password: hashedPassword,
                status: false,
            },
        });

        res.status(200).json({ message: "User registered successfully" });
    } catch (err) {
        let result = "Error when entering user: " + err;
        if (err.code === "P2002") {
            if (err.meta.target.includes("username")) {
                result = "Username already exists";
            } else if (err.meta.target.includes("email")) {
                result = "Email already exists";
            }
        }
        res.status(400).json({ error: result });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(400).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            await prisma.user.update({
                where: { id: user.id },
                data: { status: true },
            });

            res.status(200).json({
                message: "User logged in successfully",
                user,
            });
        } else {
            res.status(400).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post("/logout", async (req, res) => {
    try {
        const { email } = req.body;

        await prisma.user.updateMany({
            where: { email },
            data: { status: 0 },
        });

        res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post("/username", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        res.status(200).json({ username: user.username });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post("/profile", async (req, res) => {
    try {
        const { name } = req.body;

        const user = await prisma.user.findUnique({
            where: { username: name },
        });

        if (user.profilePicture)
            user.profilePicture = Buffer.from(user.profilePicture).toString(
                "base64"
            );
        if (user.banner)
            user.banner = Buffer.from(user.banner).toString("base64");

        res.status(200).json({ user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post(
    "/post",
    upload.fields([
        { name: "pictures", maxCount: 15 },
        { name: "attachments", maxCount: 15 },
    ]),
    async (req, res) => {
        try {
            const { email, message, locale, mood } = req.body;

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) return res.status(400).json({ error: "User not found" });

            const post = await prisma.post.create({
                data: {
                    id: uuidv4(),
                    userId: user.id,
                    message,
                    locale,
                    mood,
                    date: Date.now(),
                },
            });

            if (req.files.pictures) {
                await Promise.all(
                    req.files.pictures.map((picture) =>
                        prisma.postPicture.create({
                            data: {
                                id: uuidv4(),
                                postId: post.id,
                                picture: picture.buffer,
                            },
                        })
                    )
                );
            }

            if (req.files.attachments) {
                await Promise.all(
                    req.files.attachments.map((attachment) =>
                        prisma.attachment.create({
                            data: {
                                id: uuidv4(),
                                postId: post.id,
                                title: attachment.originalname,
                                attachment: attachment.buffer,
                            },
                        })
                    )
                );
            }

            res.status(200).json({ message: "Message posted successfully" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

app.post("/userPost", async (req, res) => {
    try {
        const { ids, username } = req.body;

        let id;
        if (username) {
            const user = await prisma.user.findUnique({
                where: { username: username },
            });
            id = user.id;
        }

        const posts = await prisma.post.findMany({
            where: {
                id: { notIn: ids },
                ...(username && { userId: id }),
            },
            orderBy: { date: "desc" },
            take: 5,
        });

        const enrichedPosts = await Promise.all(
            posts.map(async (post) => {
                const user = await prisma.user.findUnique({
                    where: { id: post.userId },
                });
                post.username = user.username;
                post.name = user.name;
                post.profilePicture = user.profilePicture
                    ? Buffer.from(user.profilePicture).toString("base64")
                    : null;

                const pictures = await prisma.postPicture.findMany({
                    where: { postId: post.id },
                });
                post.pictures = pictures.map((picture) =>
                    Buffer.from(picture.picture).toString("base64")
                );

                const attachments = await prisma.attachment.findMany({
                    where: { postId: post.id },
                });
                post.attachments = attachments.map((attachment) => ({
                    title: attachment.title,
                    file: Buffer.from(attachment.attachment).toString("base64"),
                }));

                if (typeof post.date === "bigint") {
                    post.date = post.date.toString();
                }

                return post;
            })
        );

        res.status(200).json({ posts: enrichedPosts });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
});

app.post("/user", async (req, res) => {
    try {
        const { search } = req.body;

        const users = await prisma.user.findMany({
            where: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        });

        const enrichedUsers = users.map((user) => {
            if (user.profilePicture)
                user.profilePicture = Buffer.from(user.profilePicture).toString(
                    "base64"
                );
            if (user.banner)
                user.banner = Buffer.from(user.banner).toString("base64");

            return user;
        });

        res.status(200).json({ user: enrichedUsers });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post("/hasFriend", async (req, res) => {
    try {
        const { userEmail, friendEmail } = req.body;

        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });
        const friend = await prisma.user.findUnique({
            where: { email: friendEmail },
        });

        const friendship = await prisma.friend.findFirst({
            where: { userId: user.id, friendId: friend.id },
        });

        res.status(200).json({ hasFriend: Boolean(friendship) });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post("/addFriend", async (req, res) => {
    try {
        const { userEmail, friendEmail } = req.body;

        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });
        const friend = await prisma.user.findUnique({
            where: { email: friendEmail },
        });

        await prisma.friend.create({
            data: {
                userId: user.id,
                friendId: friend.id,
            },
        });

        res.status(200).json({ message: "Friend added successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post("/friends", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        const friends = await prisma.friend.findMany({
            where: { userId: user.id },
            include: { friend: true },
        });

        const enrichedFriends = friends.map((f) => {
            if (f.friend.profilePicture)
                f.friend.profilePicture = Buffer.from(
                    f.friend.profilePicture
                ).toString("base64");
            if (f.friend.banner)
                f.friend.banner = Buffer.from(f.friend.banner).toString(
                    "base64"
                );

            return f.friend;
        });

        res.status(200).json({ friends: enrichedFriends });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post("/messages", async (req, res) => {
    try {
        const { senderName, receiverName } = req.body;

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
        console.log(err);
        res.status(400).json({ error: err.message });
    }
});

app.post("/sendMessage", async (req, res) => {
    try {
        const { senderName, receiverName, content } = req.body;

        console.log(content);

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
        console.log(err);
        res.status(400).json({ error: err.message });
    }
});

app.post("/updateAbout", async (req, res) => {
    try {
        const { email, about } = req.body;

        await prisma.user.update({
            where: { email },
            data: { about },
        });

        res.status(200).json({ message: "About updated successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post(
    "/updateProfile",
    upload.fields([
        { name: "profilePicture", maxCount: 1 },
        { name: "banner", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const { email } = req.body;

            const updateData = {};
            if (req.files.profilePicture) {
                updateData.profilePicture = req.files.profilePicture[0].buffer;
            }
            if (req.files.banner) {
                updateData.banner = req.files.banner[0].buffer;
            }

            await prisma.user.update({
                where: { email },
                data: updateData,
            });

            res.status(200).json({ message: "Profile updated successfully" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

app.get('/test', (req, res) => {
    res.send('Hello World!');
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
