const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
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
        await pool.execute(
            "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
            [userName, email, hashedPassword]
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
                const user = await pool.execute(
                    "SELECT name FROM user WHERE id = ?",
                    [row.user_id]
                );

                row.name = user[0][0].name;

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

        console.log(rows);

        if (rows.length === 0) {
            res.status(400).json({ error: "User not found" });
        } else {
            res.status(200).json({ user: rows });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
