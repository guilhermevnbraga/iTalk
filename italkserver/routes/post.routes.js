import express from "express";
import multer from "multer";
import { createPost, getUserPost } from "../controllers/postController.js";

const postRouter = express.Router();

const storage = multer.memoryStorage();
const limits = { fileSize: 1024 * 1024 * 5 };
const upload = multer({ storage, limits });

postRouter.get("/user", getUserPost);
postRouter.post(
    "/create",
    upload.fields([
        { name: "pictures", maxCount: 15 },
        { name: "attachments", maxCount: 15 },
    ]),
    createPost
);

export default postRouter;
