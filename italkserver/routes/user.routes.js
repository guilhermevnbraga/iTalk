import express from "express";
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

userRouter.get("/email/:email", getUserByEmail);
userRouter.get("/username/:username", getUserByUserName);
userRouter.get("/search/:search", searchUsers);
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.patch("/about", updateAbout);
userRouter.patch("/profile", updateProfile);

export default userRouter;
