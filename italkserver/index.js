const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const cors = require("cors");
const express = require("express");
const multer = require('multer')
const app = express();
const upload = multer({ dest: 'uploads/' })

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

app.post("/post", upload.single('pictures'), async (req, res) => {
    try {
        console.log('a')
        const { email, message, attachment, locale, mood } =
            req.body;
        const id = await pool.execute("SELECT id FROM user WHERE email = ?", [
            email,
        ]);
        const picturePath = req.file ? req.file.path : null;
        console.log(picturePath);
        await pool.execute(
            "INSERT INTO post (user_id, message, pictures, attachment, locale, mood) VALUES (?, ?, ?, ?, ?, ?)",
            [id[0][0].id, message, picturePath, attachment, locale, mood]
        );
        res.status(200).json({ message: "Message posted successfully" });
    } catch (err) {
        res.status(400).json({ error: err });
    }
});

app.post("/userPost", async (req, res) => {
    try {
        const { ids } = req.body;
        let rows = [];
        let limit = 0;
        const postQuantity = await pool.execute(
            "SELECT COUNT(*) FROM post"
        );

        for(let i = 1; i <= postQuantity[0][0]["COUNT(*)"]; i++) {
            let [row] = await pool.execute(
                "SELECT * FROM post WHERE id = ?",
                [i]
            );

            if (row[0].id in ids) {
                continue;
            }

            limit++;

            const user = await pool.execute(
                "SELECT name FROM user WHERE id = ?",
                [row[0].user_id]
            )

            row[0].name = user[0][0].name;
            row[0].picture = user[0][0].picture || null;
            rows.push(row[0]);

            if (limit === 5) {
                break;
            }
        }

        res.status(200).json({ posts: rows, max: postQuantity[0][0]["COUNT(*)"]  });
    } catch (err) {
        res.status(400).json({ error: err });
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
