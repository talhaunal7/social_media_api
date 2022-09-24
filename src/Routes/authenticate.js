//login, register
require('dotenv').config();
const router = require("express").Router();
const User = require("../Models/User");
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');


router.post("/register", async (req, res) => {
    try {
        const encryptedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString();
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: encryptedPassword
        })
        await newUser.save();
        res.status(200).json("successfully saved");
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user)
            return res.status(404).json("invalid username");

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (originalPassword !== req.body.password)
            return res.status(401).json("invalid password");

        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router