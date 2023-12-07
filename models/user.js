import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    about: {
        type: String,
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
})

const User = mongoose.model("User", userSchema);

export default User;