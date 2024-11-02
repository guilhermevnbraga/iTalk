import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function register(req, res) {
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
}

export async function login(req, res) {
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
}

export default async function logout(req, res) {
    try {
        const { email } = req.body;

        await prisma.user.updateMany({
            where: { email },
            data: { status: false },
        });

        res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function getUserByEmail(req, res) {
    try {
        const { email } = req.params;

        const user = await prisma.user.findUnique({ where: { email } });
        res.status(200).json({ user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function getUserByUserName(req, res) {
    try {
        const { username } = req.params;

        const user = await prisma.user.findUnique({ where: { username } });
        res.status(200).json({ user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function searchUsers(req, res) {
    try {
        const { search } = req.params;

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
}

export async function updateAbout(req, res) {
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
}

export async function updateProfile(req, res) {
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
