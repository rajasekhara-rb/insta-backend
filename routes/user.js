import express from "express";
import { followUser, followers, following, getUsers, searchUser, signin, signup, unFollowUser, userById } from "../controllers/user.js";
import authenticateUser from "../middleware/authorization.js"

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/", authenticateUser, getUsers);
userRouter.get("/byid/:id", authenticateUser, userById);
userRouter.put("/follow", authenticateUser, followUser);
userRouter.put("/unfollow", authenticateUser, unFollowUser);
userRouter.post("/searchUser", searchUser);
userRouter.get("/myfollowers", authenticateUser, followers)
userRouter.get("/mefollowing", authenticateUser, following)

export default userRouter;