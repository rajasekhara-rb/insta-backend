import express from "express";
import mongoose from "mongoose";
import { getUsers, signin, signup } from "../controllers/user.js";

const User = mongoose.model("User");

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

export default userRouter;