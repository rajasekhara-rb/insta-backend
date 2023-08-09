import express from "express";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.js";
import { JWT_SCECRET_KEY } from "../keys.js";

const getUsers = (req, res) => {
    User.find({}).populate("", "_id name").then((users) => {
        res.status(200).json({ Users: users })
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ message: "Something went wrong" })
    })
}

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.json({ message: "Please fill all required details" })
    } else {
        await User.findOne({ email: email })
            .then(async (savedUser) => {
                if (savedUser) {
                    res.status(422).json({ message: "User already exists. Login to proceed" })
                } else {
                    bcrypt.hash(password, 10)
                        .then((hashedPassword) => {
                            const user = new User({
                                name: name,
                                email: email,
                                password: hashedPassword
                            })
                            user.save()
                                .then((user) => {
                                    res.status(200).json({ message: "User Registered Successfully" })
                                }).catch((error) => {
                                    console.log(error);
                                    res.status(400).json({ message: "User Registration Failed. Please try again" })
                                })
                        }).catch((error) => {
                            console.log(error);
                        })
                }

                // const newUser = await User.create({ name: name, email: email, password: hashedPassword })
            }).catch((error) => {
                console.log(error)
                res.send({ message: "Something went wrong" })
            })
    }
}

const signin = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Please enter email and password" })
    } else {
        User.findOne({ email: email })
            .then((savedUser) => {
                if (!savedUser) {
                    res.status(400).json({ message: "Invalid user name or password" })
                } else {
                    bcrypt.compare(password, savedUser.password)
                        .then((doMatched) => {
                            if (doMatched) {
                                const token = Jwt.sign({ id: savedUser._id }, JWT_SCECRET_KEY)
                                res.status(200).json({ message: "Signin Successfull", token: token })
                            } else {
                                res.status(400).json({ message: "Invalid user name or password" })
                            }
                        }).catch((error) => {
                            console.log(error);
                            res.status(400).json({ message: "Invalid user name or password" })
                        })
                }
            }).catch((error) => {
                console.log(error);
                res.status(400).json({ message: "Something went wrong" });
            })
    }
}

export { signup, getUsers, signin }