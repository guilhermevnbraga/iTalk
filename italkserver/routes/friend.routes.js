import express from "express";
import { createFriend, getFriends, deleteFriend, hasFriend } from "../controllers/friendController.js";

const friendRouter = express.Router();

friendRouter.get("/list/:email", getFriends);
friendRouter.get("/hasFriend", hasFriend);
friendRouter.post("/create", createFriend);
friendRouter.delete("/delete", deleteFriend);

export default friendRouter;
