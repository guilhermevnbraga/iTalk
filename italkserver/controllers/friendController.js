import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function hasFriend(req, res) {
    try {
        const { userEmail, friendEmail } = req.query;

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
}

export async function createFriend(req, res) {
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
}

export async function getFriends(req, res) {
    try {
        const { email } = req.params;

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
}

export async function deleteFriend(req, res) {
    try {
        const { username, acessUsername } = req.query;

        const user = await prisma.user.findUnique({
            where: { username: acessUsername },
        });
        const friend = await prisma.user.findUnique({
            where: { username: username },
        });

        await prisma.friend.delete({
            where: {
                userId_friendId: {
                    userId: user.id,
                    friendId: friend.id,
                },
            },
        });

        res.status(200).json({ message: "Friend deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
