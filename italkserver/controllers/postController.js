import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createPost(req, res) {
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

export async function getUserPost(req, res) {
    try {
        const { ids, username } = req.query;

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
        res.status(400).json({ error: err.message });
    }
}
