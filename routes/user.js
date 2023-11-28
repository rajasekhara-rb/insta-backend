import express from "express";
import { followUser, getUsers, searchUser, signin, signup, unFollowUser, userById } from "../controllers/user.js";
import authenticateUser from "../middleware/authorization.js"

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/", authenticateUser, getUsers);
userRouter.get("/:id", authenticateUser, userById);
userRouter.put("/follow", authenticateUser, followUser);
userRouter.put("/unfollow", authenticateUser, unFollowUser);
userRouter.post("/searchUser", searchUser);

export default userRouter;