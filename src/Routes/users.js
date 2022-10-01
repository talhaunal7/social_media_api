const router = require("express").Router();
const User = require("../Models/User");
const CryptoJS = require("crypto-js");
const {
    verifyToken,
    verifyAuthorization
} = require("./verifyTokens");


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           description: email address of the user
 *         followers:
 *           type: Array
 *           description: id's of the followers
 *         followings:
 *           type: Array
 *           description: id's of the followings
 *         about:
 *          type: string
 *          description: about section
 *         city:
 *          type: string
 *          description: the current city the user is living in
 *         from:
 *          type: string
 *          description: the city/country the user has born in
 *         interests:
 *          type: Array
 *          description: List of the interests
 *       example:
 *         id: d5fE_aszjkndf213fkls12
 *         username: john doe
 *         email: johndoe@gmail.com
 */

 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: The User Operations 
  */

 /**
 * @swagger
 * /users/:
 *  put:
 *    summary: Update the user information
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object 
 *            example:
 *              about: new about section    
 *              city : Istanbul            
 *    responses:
 *      200:
 *        description: User is successfully updated
 *      401:
 *        description: Couldn't find a token or invalid token
 *      403:
 *        description: You are not authorized     
 *      500:
 *        description: Some error happened
 */

router.put("/", verifyToken, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString();
    }
    try {
        await User.findByIdAndUpdate(
            req.user.id,
            { $set: req.body, }
        );
        res.status(200).json("succesfully updated");
    } catch (err) {
        res.status(500).json(err);
    }
})

/**
 * @swagger
 * /users/:
 *  delete:
 *    summary: Delete the user
 *    tags: [Users]         
 *    responses:
 *      200:
 *        description: User is successfully deleted
 *      401:
 *        description: Couldn't find a token or invalid token
 *      403:
 *        description: You are not authorized     
 *      500:
 *        description: Some error happened
 */

router.delete("/", verifyToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json("account has been deleted");
    } catch (err) {
        console.log(err)
        return res.status(500).json(err);
    }
})

/**
 * @swagger
 * /users/follow:
 *  put:
 *    summary: Follow another user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object 
 *            example:
 *              id: 238orjf43ofj34fjo30foj3
 *    responses:
 *      200:
 *        description: User is successfully followed
 *      401:
 *        description: Couldn't find a token or invalid token
 *      403:
 *        description: Auth error or already following
 *      500:
 *        description: Some error happened
 */

router.put("/follow", verifyToken, async (req, res) => {

    if (req.user.id !== req.body.id) {
        try {
            const targetUser = await User.findById(req.body.id);
            const currentUser = await User.findById(req.user.id);
            if (!targetUser.followers.includes(currentUser._id)) {
                await targetUser.updateOne({ $push: { followers: currentUser._id } });
                await currentUser.updateOne({ $push: { followings: targetUser._id } });
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("you are already following this user");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("you can't follow your own account");
    }

})
/**
 * @swagger
 * /users/unfollow:
 *  put:
 *    summary: Unfollow another user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object 
 *            example:
 *              id: 238orjf43ofj34fjo30foj3
 *    responses:
 *      200:
 *        description: User is successfully unfollowed
 *      401:
 *        description: Couldn't find a token or invalid token
 *      403:
 *        description: Auth error or not following
 *      500:
 *        description: Some error happened
 */

router.put("/unfollow", verifyToken, async (req, res) => {
    if (req.user.id !== req.body.id) {
        const targetUser = await User.findById(req.body.id);
        const currentUser = await User.findById(req.user.id);
        if (targetUser.followers.includes(currentUser._id)) {
            let index = targetUser.followers.indexOf(currentUser._id);
            if (index > -1) {
                targetUser.followers.splice(index, 1);
            }
            index = currentUser.followings.indexOf(targetUser._id);
            if (index > -1) {
                currentUser.followings.splice(index, 1);
            }
            await targetUser.save();
            await currentUser.save();
            res.status(200).json("user has been unfollowed");
        } else {
            res.status(403).json("you are not following this user");
        }
    } else {
        res.status(403).json("you can't unfollow your own account")
    }
})





module.exports = router