import express from "express";
import multer from "multer";
import {
    register,
    login,
    logout,
    getUserByEmail,
    getUserByUserName,
    searchUsers,
    updateAbout,
    updateProfile,
} from "../controllers/userController.js";

const userRouter = express.Router();

const storage = multer.memoryStorage();
const limits = { fileSize: 1024 * 1024 * 5 };
const upload = multer({ storage, limits });

userRouter.get("/email/:email", getUserByEmail);
userRouter.get("/username/:username", getUserByUserName);
userRouter.get("/search/:search", searchUsers);
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.patch("/about", updateAbout);
userRouter.patch(
    "/profile",
    upload.fields([
        { name: "profilePicture", maxCount: 1 },
        { name: "banner", maxCount: 1 },
    ]),
    updateProfile
);

export default userRouter;
