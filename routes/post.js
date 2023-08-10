import express from "express";
import mongoose from "mongoose";
import { createPost, deletePost, getAllPosts, getMyPosts, getPostById, updatePost } from "../controllers/post.js";
import authenticateUser from "../middleware/authorization.js";
const postRouter = express.Router();

postRouter.get("/allposts", getAllPosts);
postRouter.get("/:id", authenticateUser, getPostById);
postRouter.get("/", authenticateUser, getMyPosts);
postRouter.post("/", authenticateUser, createPost);
postRouter.put("/:id", authenticateUser, updatePost);
postRouter.delete("/:id", authenticateUser, deletePost)

export default postRouter;