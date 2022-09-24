const router = require("express").Router();
const User = require("../Models/User");
const CryptoJS = require("crypto-js");
const {
    verifyToken,
    verifyAuthorization
} = require("./verifyTokens");

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

router.delete("/", verifyToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json("account has been deleted");
    } catch (err) {
        console.log(err)
        return res.status(500).json(err);
    }
})

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