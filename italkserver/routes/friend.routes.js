import express from "express";
import { createFriend, getFriends, deleteFriend, hasFriend } from "../controllers/friendController.js";

const friendRouter = express.Router();

friendRouter.get("/getFriends/:email", getFriends);
friendRouter.get("/hasFriend", hasFriend);
friendRouter.post("/create", createFriend);
friendRouter.delete("/deleteFriend", deleteFriend);

export default friendRouter;
