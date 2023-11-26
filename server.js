import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { MongoURI, PORT } from "./keys.js";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";

// import User from "./models/user.js";
// import Post from "./models/post.js";
// const User = mongoose.model("User");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/post", postRouter);
// const PORT = 1234;

// const connectToMongoDB = async () => {
//     try {
//         await mongoose.connect(MongoURI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log("Connection to the MonogDB database Successful.")
//     } catch (error) {
//         console.log(error)
//         console.log("Connection to the MonogDB database failed.")
//     }
// }
// connectToMongoDB();

mongoose.connect(MongoURI
    // , {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // }
);

mongoose.connection.on("connected", () => {
    console.log("Connection to the mongoDB database is successfull")
});

mongoose.connection.on("error", () => {
    console.log("Error: connection to the mongoDB database is failed")
})

app.get("/", (req, res) => {
    res.status(400).json({ message: "Server is Live" })
})

app.listen(PORT, (err) => {
    console.log("Server is listing on " + PORT)
})