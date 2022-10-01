const router = require("express").Router();
const User = require("../Models/User");
const Post = require("../Models/Post");
const {
    verifyToken,
    verifyAuthorization
} = require("./verifyTokens");

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         userId:
 *           type: string
 *           description: id of the post's owner 
 *         description:
 *           type: string  
 *           description: content of the post
 *         likes:
 *           type: Array
 *           description: an array of the user ids who liked the post        
 *       example:
 *         id: 823uru2rıjo438foj
 *         description: I had a great day today!
 */

/**
  * @swagger
  * tags:
  *   name: Posts
  *   description: The Post Operations 
  */

/**
 * @swagger
 * /posts/:
 *  post:
 *    summary: Create a post
 *    tags: [Posts]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object 
 *            example:
 *              description: this is my first post on social media!
 *    responses:
 *      200:
 *        description: The post is published
 *      401:
 *        description: Couldn't find a token or invalid token
 *      403:
 *        description: Auth error or empty post
 *      500:
 *        description: Some error happened
 */

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

/**
 * @swagger
 * /posts/:
 *  put:
 *    summary: Update a post
 *    tags: [Posts]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object 
 *            example:
 *              postId: sjfks7yhfh8349fj348fj
 *              description: this is my updated post
 *    responses:
 *      200:
 *        description: The post is updated
 *      401:
 *        description: Couldn't find a token or invalid token
 *      403:
 *        description: Auth error
 *      500:
 *        description: Some error happened
 */

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

/**
 * @swagger
 * /posts/:
 *  delete:
 *    summary: Delete a post
 *    tags: [Posts]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object 
 *            example:
 *              postId: sjfks7yhfh8349fj348fj
 *    responses:
 *      200:
 *        description: The post is deleted
 *      401:
 *        description: Couldn't find a token or invalid token
 *      403:
 *        description: Auth error
 *      500:
 *        description: Some error happened
 */

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

/**
 * @swagger
 * /posts/like:
 *  put:
 *    summary: Like a post
 *    tags: [Posts]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object 
 *            example:
 *              postId: sjfks7yhfh8349fj348fj
 *    responses:
 *      200:
 *        description: The post is liked or disliked 
 *      401:
 *        description: Couldn't find a token or invalid token
 *      403:
 *        description: Auth error
 *      500:
 *        description: Some error happened
 */

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

/**
 * @swagger
 * /posts/timeline:
 *  get:
 *    summary: Get timeline posts
 *    tags: [Posts]
 *    responses:
 *      200:
 *       content:
 *         application/json:
 *           schema:          
 *             example:
 *               postId: 823ur238rfj238f23 
 *               description: ldnslkf 
 *           
 *      401:
 *        description: Couldn't find a token or invalid token
 *      403:
 *        description: Auth error
 *      500:
 *        description: Some error happened
 */

router.get("/timeline", verifyToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        let followingsPosts = [];
        for (let i = 0; i < currentUser.followings.length; i++) {
            const posts = await Post.find({ userId: currentUser.followings[i] });
            posts.forEach((post) => {
                followingsPosts.push(post._id)
            })
        }
        res.status(200).json(followingsPosts);
    } catch (error) {
        res.status(500).json(error);
    }
})



module.exports = router