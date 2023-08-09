import express from "express";
import mongoose from "mongoose";
import Post from "../models/post.js";
// const Post = mongoose.model("Post");


const getAllPosts = (req, res) => {
    Post.find({})
        .then((data) => {
            res.status(200).json({ posts: data })
        }).catch((error) => {
            console.log(error)
            res.status(400).json({ error: error })
        })
    // res.send("all posts")
}

const getPostById = (req, res) => {

}

const getMyPosts = (req, res) => {
    res.send("my posts")
}

const createPost = (req, res) => {
    const data = req.body;
    const newPost = new Post({
        title: data.title,
        body: data.body,
        photo: data.photo,
        postedBy:""
    })
    newPost.save()
        .then((data) => {
            res.status(200).json({ message: "Post created successfully", post: data })
        }).catch((error) => {
            res.status(400).json({ error: error })
        })

    res.send("create post")
}

const updatePost = (req, res) => {
    res.send("update post")
}

const deletePost = (req, res) => {
    res.send("update post")
}


export {
    getAllPosts,
    getPostById,
    getMyPosts,
    createPost,
    updatePost,
    deletePost
}