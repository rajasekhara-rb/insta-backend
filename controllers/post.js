import express from "express";
import mongoose from "mongoose";
import Post from "../models/post.js";
// const Post = mongoose.model("Post");

const getAllPosts = (req, res) => {
    Post.find({}).populate("postedBy", "_id name")
        .then((data) => {
            res.status(200).json({ posts: data })
        }).catch((error) => {
            console.log(error)
            res.status(400).json({ error: error })
        })
    // res.send("all posts")
}

const getPostById = (req, res) => {
    const id = req.params.id;
    Post.findById(id)
        .then((post) => {
            res.status(200).json({ post })
        })
        .catch((error) => {
            console.log(error)
            res.status(400).json({ error: "Something went wrong" })
        })
}

const getMyPosts = (req, res) => {
    const userId = req.user._id;
    Post.find({ postedBy: userId })
        .then((data) => {
            res.status(200).json({ myposts: data })
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error: "Something went wrong" })
        })
    // res.send("my posts")
}

const createPost = (req, res) => {
    const data = req.body;
    const newPost = new Post({
        title: data.title,
        body: data.body,
        photo: data.photo,
        postedBy: req.user
    })
    newPost.save()
        .then(async (data) => {
            const newdata = await data.populate("postedBy", "_id name");
            res.status(200).json({ message: "Post created successfully", post: newdata })
        })
        .catch((error) => {
            console.log(error)
            res.status(400).json({ error: "Post creation Failed. Try Again" })
        })

    // res.send("create post")
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