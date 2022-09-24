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



module.exports = router