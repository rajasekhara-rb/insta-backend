import express from "express";

import { commentPost, createPost, deletePost, dislikePost, getAllPosts, getMyPosts, getPostById, likePost, updatePost } from "../controllers/post.js";
import authenticateUser from "../middleware/authorization.js";
const postRouter = express.Router();

postRouter.get("/allposts", getAllPosts);
postRouter.get("/:id", authenticateUser, getPostById);
postRouter.get("/", authenticateUser, getMyPosts);
postRouter.post("/", authenticateUser, createPost);
postRouter.put("/update/:id", authenticateUser, updatePost);
postRouter.put("/like", authenticateUser, likePost);
postRouter.put("/dislike", authenticateUser, dislikePost);
postRouter.put("/comment", authenticateUser, commentPost);
postRouter.delete("/:id", authenticateUser, deletePost);

export default postRouter;