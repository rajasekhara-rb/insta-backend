import express from "express";
import { getUsers, signin, signup } from "../controllers/user.js";
import authenticateUser from "../middleware/authorization.js"

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/", authenticateUser, getUsers);

export default userRouter;