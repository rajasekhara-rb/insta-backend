import express from "express";
import mongoose from "mongoose";
import { createPost, deletePost, getAllPosts, getMyPosts, getPostById, updatePost } from "../controllers/post.js";
const postRouter = express.Router();

postRouter.get("/allposts", getAllPosts);
postRouter.get("/:id", getPostById);
postRouter.get("/", getMyPosts);
postRouter.post("/", createPost);
postRouter.put("/:id", updatePost);
postRouter.delete("/:id", deletePost)

export default postRouter;