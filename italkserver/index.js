import express from "express";
import cors from "cors";
import friendRouter from "./routes/friend.routes.js";
import messageRouter from "./routes/message.routes.js";
import postRouter from "./routes/post.routes.js";
import userRouter from "./routes/user.routes.js";

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
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/friend", friendRouter);
app.use("/message", messageRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
