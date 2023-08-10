// import express from "express";
import mongoose from "mongoose";
import { JWT_SCECRET_KEY } from "../keys.js";
import User from "../models/user.js";
// const User = mongoose.model("User");
import jwt from "jsonwebtoken";

const authenticateUser = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith("Bearer ")) {
            res.status(401).json({ error: "Unauthorized Users. Please login First. headers missing" })
        } else {
            const token = authorization.replace("Bearer ", "");

            const payload = jwt.verify(token, JWT_SCECRET_KEY);
            // const { _id } = payload;

            const userdata = await User.findById(payload.id);
            // console.log(userdata)

            if (!userdata) {
                res.status(401).json({ error: "Unauthorized User. Please login First" })
            } else {
                // res.status(200).json({message:"User authentication successfull"})
                req.user = userdata;
                next()
            }
            // .then((userdata) => {
            // req.user = userdata;
            // next()
            // }).catch((error) => {
            //     console.log(error);
            //     res.status(401).json({ error: "Unauthorized User. Please login First" })
            // })


        }

    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Unauthorized User. You must be logged in to access" })
    }
}

export default authenticateUser;