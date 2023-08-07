import express from "express";


const getAllPosts = (req, res) => {
    res.send("all posts")
}

const getPostById = (req, res) => {

}
const createPost = (req, res) => {
    res.send("create post")
}
const updatePost = (req, res) => {
    res.send("update post")
}

export {
    getAllPosts,
}