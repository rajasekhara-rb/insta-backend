import Post from "../models/post.js";
import { deleteCloudinayImage } from "../utils/cloudinaryUtil.js";
// const Post = mongoose.model("Post");

const getAllPosts = (req, res) => {
    Post.find({})
        .populate("postedBy", "_id name photo")
        .populate("comments.postedBy", "_id name photo")
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
        .populate("comments.postedBy", "_id name photo")
        .populate("postedBy", "_id name photo")
        .then((post) => {
            res.status(200).json({ post: post })
        })
        .catch((error) => {
            console.log(error)
            res.status(400).json({ error: "Something went wrong" })
        })
}

const getMyPosts = (req, res) => {
    const userId = req.user._id;
    Post.find({ postedBy: userId })
        .populate("postedBy", "_id name photo")
        .populate("comments.postedBy", "_id name photo")
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
            const newdata = await data.populate("postedBy", "_id name photo");
            res.status(200).json({ message: "Post created successfully", post: newdata })
        })
        .catch((error) => {
            console.log(error)
            res.status(400).json({ error: "Post creation Failed. Try Again" })
        })

    // res.send("create post")
}

const updatePost = async (req, res) => {
    // res.send("update post");
    try {
        const { title, body } = req.body;

        const post = await Post.findOne({ _id: req.params.id })
            .populate("postedBy", "_id")
            .exec();
        if (req.user._id.toString() === post.postedBy._id.toString()) {
            const result = await Post.findByIdAndUpdate(
                req.params.id,
                { title, body },
                { new: true }
            ).populate("postedBy", "_id name photo")
                .populate("comments.postedBy", "_id name photo")
                .then((data) => {
                    res.json(data);
                })

        } else {
            res.status(200).json({ error: "Unauthorized Updation Request" })
        }

        // const result = await Post.findByIdAndUpdate(
        //     req.params.id,
        //     { title, body },
        //     { new: true }
        // ).populate("postedBy", "_id name photo")
        // .exec();
        // res.json(result);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: "Post Updation Failed. Try Again" })
    }
}

const likePost = async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            { $push: { likes: req.user._id } },
            { new: true }
        ).populate("postedBy", "_id name photo")
            .populate("comments.postedBy", "_id name photo")
            .exec();
        res.json(result);
    } catch (error) {
        res.status(422).json({ error: error });
    }
}

const dislikePost = async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likes: req.user._id } },
            { new: true }
        ).populate("postedBy", "_id name photo")
            .populate("comments.postedBy", "_id name photo")
            .exec();
        res.json(result);
    } catch (error) {
        res.status(422).json({ error: error });
    }
}

const commentPost = async (req, res) => {
    // console.log(req.body)
    try {
        const comment = {
            text: req.body.text,
            postedBy: req.user._id
        }

        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            { $push: { comments: comment } },
            { new: true }
        ).populate("comments.postedBy", "_id name photo")
            .populate("postedBy", "_id name photo")
            .exec();

        res.json(result);

    } catch (error) {
        res.status(422).json({ error: error });
    }
}

const deletePost = async (req, res) => {
    try {

        const post = await Post.findOne({ _id: req.params.id })
            .populate("postedBy", "_id name photo")
            .exec();
        if (!post) {
            return res.status(422).json({ error: err })
        }

        if (post.postedBy._id.toString() === req.user._id.toString()) {

            await deleteCloudinayImage(post.photo);

            const result = await post.deleteOne();
            res.json(result);
        }

    } catch (error) {
        res.status(422).json({ error: error });
    }
    // res.send("update post")
}


export {
    getAllPosts,
    getPostById,
    getMyPosts,
    createPost,
    updatePost,
    likePost,
    dislikePost,
    commentPost,
    deletePost
}