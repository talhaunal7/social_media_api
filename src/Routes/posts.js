const router = require("express").Router();
const User = require("../Models/User");
const Post = require("../Models/Post");
const {
    verifyToken,
    verifyAuthorization
} = require("./verifyTokens");
//const { model } = require("mongoose");


router.post("/", verifyToken, async (req, res) => {
    if (!req.body.description)
        return res.status(403).json("the post can't be empty!")
    const newPost = new Post({ userId: req.user.id, description: req.body.description })
    try {
        await newPost.save();
        res.status(200).json("successfully posted");
    } catch (error) {
        res.status(500).json(error);
    }
})

router.put("/", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.body.postId);
        if (req.user.id === post.userId) {
            await post.updateOne({ description: req.body.description });
            res.status(200).json("the post has been updated");
        } else {
            res.status(403).json("you can only update your post!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

router.delete("/", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.body.postId);
        if (req.user.id === post.userId) {
            await post.deleteOne();
            res.status(200).json("the post has been deleted");
        }
        else {
            res.status(403).json("you can only delete your post!")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put("/like", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.body.postId);
        if (!post.likes.includes(req.user.id)) {
            await post.updateOne({ $push: { likes: req.user.id } });
            res.status(200).json("you have liked the post");
        } else {
            await post.updateOne({ $pull: { likes: req.user.id } });
            res.status(200).json("you have disliked the post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})



module.exports = router