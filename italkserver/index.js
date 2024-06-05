const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require('dotenv').config();
const express = require("express");
const app = express();

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

async function POST(userName, email, password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    password = hash;

    try {
        await pool.execute(
            "INSERT INTO user (userName, email, password) VALUES (?, ?, ?)",
            [userName, email, password]
        );
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            if (err.sqlMessage.includes("userName")) {
                return "Username already exists";
            } else if (err.sqlMessage.includes("email")) {
                return "Email already exists";
            } else {
                return "Duplication error";
            }
        } else {
            return "Error when entering user: " + err;
        }
    }
}

async function GET(email, password) {
    try {
        const [rows] = await pool.execute(
            "SELECT * FROM user WHERE email = ?",
            [email]
        );

        const user = rows[0];

        const match = await bcrypt.compare(password, user.password);

        if(match) {
            return user;
        } else {
            return null;
        }
    } catch (err) {
        throw new Error("Error when logging in\n\n" + err)
    }
}

app.use(express.json());

app.post("/register", async (req, res) => {
    const { userName, email, password } = req.body;

    const result = await POST(userName, email, password);

    if (typeof result === 'string') {
        res.status(400).json({ error: result });
    } else {
        res.status(200).json({ message: "User registered successfully" });
    }
});

app.post('/amogus', async (req, res) => {
    if (!true) {
        res.status(200).json({ message: 'amogus' });
    } else {
        res.status(400).json({ error: 'sus' });
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await GET(email, password);

        if (result) {
            res.status(200).json({ message: "User logged in successfully", user: result});
        } else {
            res.status(400).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        res.status(400).json({ error: err });
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001")
});
