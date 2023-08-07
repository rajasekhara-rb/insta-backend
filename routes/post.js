import express from "express";
import mongoose from "mongoose";
import { getAllPosts } from "../controllers/post.js";
 const postRouter = express.Router();

 postRouter.get("/", getAllPosts);

 export default postRouter;