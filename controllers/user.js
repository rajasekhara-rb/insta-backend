import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import User from "../models/user.js";
import { JWT_SCECRET_KEY } from "../keys.js";
import Post from "../models/post.js";
import { deleteCloudinayImage } from "../utils/cloudinaryUtil.js";

const getUsers = (req, res) => {
    User.find({})
        .select("-password")
        .then((users) => {
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
                                const { _id, name, email } = savedUser;
                                res.status(200).json({ message: "Signin Successfull", token: token, user: { _id, name, email } })
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

const userById = async (req, res) => {
    try {
        // const id = req.params.userid
        const user = await User.findOne({ _id: req.params.id }).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await Post.find({ postedBy: req.params.id })
            .populate('postedBy', '_id name')
            .exec();
        res.json({ user, posts })

    } catch (error) {
        return res.status(422).json({ error: error.message })
    }
}

const followUser = async (req, res) => {
    try {
        //first->we have to know the id of the user whom we want to follow
        const followedUser = await User.findByIdAndUpdate(
            req.body.followId,
            { $push: { followers: req.user._id } },
            { new: true }
        ).select("-password")
        //error
        // if (err) {
        //     return res.status(422).json({ error: err });
        // }

        //second->we hae to know the id of the user who is following
        const followingUser = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followId } },
            { new: true }
        ).select("-password");

        //send response to user with updated information about a person they followed.
        res.json(followedUser, followingUser)
    } catch (error) {
        return res.status(422).json({ error: error });
    }
}

const unFollowUser = async (req, res) => {
    try {
        //first->we have to know the id of the user whom we want to follow
        const followedUser = await User.findByIdAndUpdate(
            req.body.unfollowId,
            { $pull: { followers: req.user._id } },
            { new: true }
        ).select("-password");
        //error 
        // if (err) {
        //     return res.status(422).json({ error: err });
        // }

        const followingUser = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.unfollowId } },
            { new: true }

        ).select("-password");
        //send a response to user about person they unfollowed.

        res.json(followingUser, followedUser);

    } catch (error) {
        return res.status(422).json({ error: error })
    }
}

const followers = async (req, res) => {
    try {
        const followers = await User.find({ following: { $in: [req.user._id] } })
            .select("-password");
        // const followers = await User.aggregate([{
        //     $project: {
        //         $exists: {
        //             $in: [req.user._id, "$following._id"]
        //         }
        //     }
        // }])
        res.json({ followers: followers })
    } catch (error) {
        return res.status(422).json({ error: error });
    }
}

const following = async (req, res) => {
    try {
        const following = await User.find({ followers: { $in: [req.user._id] } })
            .select("-password");
        res.json({ following: following })
    } catch (error) {
        return res.status(422).json({ error: error });
    }
}

const searchUser = async (req, res) => {
    try {
        //create a regex pattern match the user query.
        let userpattern = new RegExp("^" + req.body.query)

        //search a user User Schema for user whose email matches with the pattern 
        const users = await User.find({ email: { $regex: userpattern } }).select("-password")

        //send a response 
        res.json({ users });
    } catch (error) {
        return res.status(422).json({ error: error });
    }
}

const editProfile = async (req, res) => {
    try {
        const { name, username, about, photo, saveCurrentPhoto } = req.body;

        const oldProfile = await User.findById(req.user._id);
        // const newProfile = {
        //     name,
        //     username,
        //     about,
        //     photo,
        //    prevPhotos:saveOldPhoto?oldProfile.photo:""
        // }

        if (saveCurrentPhoto === true) {
            if (!oldProfile.prevPhotos.includes(oldProfile.photo)) {
                await User.findByIdAndUpdate(
                    req.user._id,
                    {
                        $push: { prevPhotos: oldProfile.photo }
                    },
                    { new: true }
                )
            }
        } else {
            await deleteCloudinayImage(oldProfile.photo);
        }

        const profile = await User.findByIdAndUpdate(
            req.user._id,
            {
                name,
                username,
                about,
                photo,
                // $push: { prevPhotos: saveCurrentPhoto ? oldProfile.photo:"" }
            },
            { new: true }
        ).select("-password");

        res.json({ profile: profile });
    } catch (error) {
        // console.log(error)
        return res.status(422).json({ error: error });
    }

}

const changeProfilePic = async (req, res) => {
    const { saveCurrentPhoto, photo } = req.body;
    try {
        const oldProfile = await User.findById(req.user._id);

        if (saveCurrentPhoto === true) {
            if (!oldProfile.prevPhotos.includes(oldProfile.photo)) {
                await User.findByIdAndUpdate(
                    req.user._id,
                    {
                        $push: { prevPhotos: oldProfile.photo },
                    },
                    { new: true }
                )
            }
        } else {
            await deleteCloudinayImage(oldProfile.photo);
        }

        await User.findByIdAndUpdate(
            req.user._id,
            {
                photo
            },
            { new: true }
        )


    } catch (error) {
        return res.status(422).json({ error: error });
    }

}

const deleteOldSavedProfilePic = async (req, res) => {
    try {
        const user = User.findOne({ _id: req.user._id });
        // if (user.prevPhotos.includes(req.body.url)) {
            await User.findByIdAndUpdate(
                req.user._id,
                { $pull: { prevPhotos: req.body.url } },
                { new: true }
            ).then((data) => {
                deleteCloudinayImage(req.body.url);
                res.json({ user: data });
            })
        // }
    } catch (error) {
        return res.status(422).json({ error: error });
    }
}

export {
    signup,
    getUsers,
    signin,
    userById,
    followUser,
    unFollowUser,
    searchUser,
    followers,
    following,
    editProfile,
    changeProfilePic,
    deleteOldSavedProfilePic
}