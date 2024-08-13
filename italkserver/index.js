const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const {
    waitUntilSymbol,
} = require("next/dist/server/web/spec-extension/fetch-event");
const app = express();

const storage = multer.memoryStorage();

const limits = {
    fileSize: 1024 * 1024 * 5,
};

const upload = multer({
    storage: storage,
    limits: limits,
});

app.use(cors());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

app.use(express.json());

app.post("/register", async (req, res) => {
    let result = null;
    const { userName, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const hashedPassword = hash;

    try {
        let newUserName = userName.replaceAll(" ", "").toLowerCase();

        const userNameExists = await pool.execute(
            "select * from user where username like ?",
            [`${newUserName}`]
        );

        if (userNameExists[0].length > 0) {
            newUserName = `${newUserName}${userNameExists[0].length + 1}`;
        }

        await pool.execute(
            "INSERT INTO user (name, username, email, password, status) VALUES (?, ?, ?, ?, ?)",
            [userName, newUserName, email, hashedPassword, 0]
        );
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            if (err.sqlMessage.includes("name")) {
                result = "Username already exists";
            } else if (err.sqlMessage.includes("email")) {
                result = "Email already exists";
            } else {
                result = "Duplication error";
            }
        } else {
            result = "Error when entering user: " + err;
        }
    }

    if (result) {
        res.status(400).json({ error: result });
    } else {
        res.status(200).json({ message: "User registered successfully" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const [rows] = await pool.execute(
            "SELECT * FROM user WHERE email = ?",
            [email]
        );

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            const id = await pool.execute(
                "SELECT id FROM user WHERE email = ?",
                [email]
            );

            await pool.execute("update user set status = 1 where id = ?", [
                id[0][0].id,
            ]);

            res.status(200).json({
                message: "User logged in successfully",
                user: user,
            });
        } else {
            res.status(400).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        res.status(400).json({ error: err });
    }
});

app.post("/logout", async (req, res) => {
    try {
        const { email } = req.body;

        const id = await pool.execute("SELECT id FROM user WHERE email = ?", [
            email,
        ]);

        await pool.execute("update user set status = 0 where id = ?", [
            id[0][0].id,
        ]);

        res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
        res.status(400).json({ error: err });
    }
});

app.post("/username", async (req, res) => {
    try {
        const { email } = req.body;

        const [rows] = await pool.execute(
            "SELECT username FROM user WHERE email = ?",
            [email]
        );

        res.status(200).json({ username: rows[0].username });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post("/profile", async (req, res) => {
    try {
        const { name } = req.body;

        const [rows] = await pool.execute(
            "SELECT * FROM user WHERE username = ?",
            [name]
        );

        if (rows[0].profile_picture)
            rows[0].profile_picture = Buffer.from(
                rows[0].profile_picture
            ).toString("base64");
        if (rows[0].banner)
            rows[0].banner = Buffer.from(rows[0].banner).toString("base64");

        res.status(200).json({ user: rows[0] });
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
            const [user] = await pool.execute(
                "SELECT id FROM user WHERE email = ?",
                [email]
            );
            const userId = user[0].id;
            const id = uuidv4();
            await pool.execute(
                "INSERT INTO post (id, user_id, message, locale, mood, date) VALUES (?, ?, ?, ?, ?, ?)",
                [id, userId, message, locale || null, mood || null, Date.now()]
            );

            if (req.files.pictures) {
                req.files.pictures.forEach(async (picture) => {
                    await pool.execute(
                        "INSERT INTO post_picture (id, post_id, picture) VALUES (?, ?, ?)",
                        [uuidv4(), id, picture.buffer]
                    );
                });
            }

            if (req.files.attachments) {
                req.files.attachments.forEach(async (attachment) => {
                    await pool.execute(
                        "INSERT INTO attachments (id, post_id, title, attachment) VALUES (?, ?, ?, ?)",
                        [
                            uuidv4(),
                            id,
                            attachment.originalname,
                            attachment.buffer,
                        ]
                    );
                });
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
            id = await pool.execute(`SELECT id FROM user WHERE name = ?`, [
                username,
            ]);
        }

        const [rows] = await pool.execute(
            `SELECT * FROM post${
                ids.length || username
                    ? ids.length
                        ? username
                            ? ` WHERE id NOT IN (${ids
                                  .map(() => "?")
                                  .join(", ")}) and user_id = (${id[0][0].id})`
                            : ` WHERE id NOT IN (${ids
                                  .map(() => "?")
                                  .join(", ")})`
                        : username
                        ? ` WHERE user_id = (${id[0][0].id})`
                        : ""
                    : ""
            } ORDER BY DATE DESC LIMIT 5`,
            ids
        );

        const posts = await Promise.all(
            rows.map(async (row) => {
                const userName = await pool.execute(
                    "select username from user where id = ?",
                    [row.user_id]
                );

                row.username = userName[0][0].username;

                const user = await pool.execute(
                    "SELECT * FROM user WHERE id = ?",
                    [row.user_id]
                );

                row.name = user[0][0].name;
                row.profilePicture = Buffer.from(
                    user[0][0].profile_picture
                ).toString("base64");

                const rawPictures = await pool.execute(
                    "SELECT picture FROM post_picture WHERE post_id = ?",
                    [row.id]
                );

                const pictures = rawPictures[0].map((picture) =>
                    Buffer.from(picture.picture).toString("base64")
                );

                row.pictures = pictures;

                const rawAttachments = await pool.execute(
                    "SELECT title, attachment FROM attachments WHERE post_id = ?",
                    [row.id]
                );

                if (rawAttachments[0].length === 0) {
                    return row;
                }

                const attachments = rawAttachments[0].map((attachment) => {
                    return [
                        attachment.title,
                        Buffer.from(attachment.attachment).toString("base64"),
                    ];
                });

                row.attachments = attachments;

                return row;
            })
        );

        res.status(200).json({ posts });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post("/user", async (req, res) => {
    try {
        const { search } = req.body;

        const [rows] = await pool.execute(
            "SELECT * FROM user WHERE name LIKE ?",
            [`%${search}%`]
        );

        const newRows = rows.map((row) => {
            if (row.profile_picture)
                row.profile_picture = Buffer.from(row.profile_picture).toString(
                    "base64"
                );
            if (row.banner)
                row.banner = Buffer.from(row.banner).toString("base64");

            return row;
        });

        if (rows.length === 0) {
            res.status(400).json({ error: "User not found" });
        } else {
            res.status(200).json({ user: rows });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post("/hasFriend", async (req, res) => {
    try {
        const { userEmail, friendEmail } = req.body;

        const userId = await pool.execute(
            "SELECT id FROM user WHERE email = ?",
            [userEmail]
        );
        const friendId = await pool.execute(
            "SELECT id FROM user WHERE email = ?",
            [friendEmail]
        );

        const [rows] = await pool.execute(
            "SELECT * FROM friend WHERE user_id = ? AND friend_id = ?",
            [userId[0][0].id, friendId[0][0].id]
        );

        if (rows.length === 0) {
            res.status(200).json({ hasFriend: false });
        } else {
            res.status(200).json({ hasFriend: true });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post("/addFriend", async (req, res) => {
    try {
        const { userEmail, friendEmail } = req.body;

        const userId = await pool.execute(
            "SELECT id FROM user WHERE email = ?",
            [userEmail]
        );
        const friendId = await pool.execute(
            "SELECT id FROM user WHERE email = ?",
            [friendEmail]
        );

        await pool.execute(
            "INSERT INTO friend (user_id, friend_id) VALUES (?, ?)",
            [userId[0][0].id, friendId[0][0].id]
        );

        res.status(200).json({ message: "Friend added successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post("/friends", async (req, res) => {
    try {
        const { email } = req.body;

        const userId = await pool.execute(
            "SELECT id FROM user WHERE email = ?",
            [email]
        );

        const [rows] = await pool.execute(
            "SELECT * FROM friend WHERE user_id = ?",
            [userId[0][0].id]
        );

        const friends = await Promise.all(
            rows.map(async (row) => {
                const friend = await pool.execute(
                    "SELECT * FROM user WHERE id = ?",
                    [row.friend_id]
                );
9
                return friend[0][0];
            })
        );

        const newFriends = friends.map((friend) => {
            if (friend.profile_picture)
                friend.profile_picture = Buffer.from(
                    friend.profile_picture
                ).toString("base64");
            if (friend.banner)
                friend.banner = Buffer.from(friend.banner).toString("base64");

            return friend;
        });

        newFriends.sort((a, b) => a.name.localeCompare(b.name));    

        res.status(200).json({ newFriends });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post("/about", async (req, res) => {
    try {
        const { email, about } = req.body;

        const userId = await pool.execute(
            "select id from user where email = ?",
            [email]
        );

        await pool.execute("update user set about = ? where id = ?", [
            about,
            userId[0][0].id,
        ]);

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
            const { email, name, username, password, newPassword } = req.body;

            const userId = await pool.execute(
                "select id from user where email = ?",
                [email]
            );

            if (password && newPassword) {
                const [user] = await pool.execute(
                    "select * from user where id = ?",
                    [userId[0][0].id]
                );
                const match = await bcrypt.compare(password, user[0].password);

                if (match) {
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(newPassword, salt);
                    const hashedPassword = hash;

                    await pool.execute(
                        "update user set password = ? where id = ?",
                        [hashedPassword, userId[0][0].id]
                    );
                } else {
                    res.status(400).json({ error: "Invalid credentials" });
                }
            }

            if (name)
                await pool.execute("update user set name = ? where id = ?", [
                    name,
                    userId[0][0].id,
                ]);

            if (username)
                await pool.execute(
                    "update user set username = ? where id = ?",
                    [username, userId[0][0].id]
                );

            if (req.files.profilePicture) {
                const profilePicture = req.files.profilePicture[0].buffer;
                await pool.execute(
                    "update user set profile_picture = ? where id = ?",
                    [profilePicture, userId[0][0].id]
                );
            }

            if (req.files.banner) {
                const banner = req.files.banner[0].buffer;
                await pool.execute("update user set banner = ? where id = ?", [
                    banner,
                    userId[0][0].id,
                ]);
            }

            res.status(200).json({ message: "Profile updated successfully" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

app.post("/deleteFriend", async (req, res) => {
    try {
        const { username, acessUsername } = req.body;

        const userId = await pool.execute(
            "select id from user where username = ?",
            [username]
        );
        const acessUserId = await pool.execute(
            "select id from user where username = ?",
            [acessUsername]
        );

        console.log(userId[0][0].id, acessUserId[0][0].id);

        await pool.execute(
            "delete from friend where (user_id, friend_id) = (?, ?)",
            [acessUserId[0][0].id, userId[0][0].id]
        );

        res.status(200).json({ message: "Friend deleted successfully" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
