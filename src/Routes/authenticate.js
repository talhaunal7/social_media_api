//login, register
require('dotenv').config();
const router = require("express").Router();
const User = require("../Models/User");
var CryptoJS = require("crypto-js");


router.post("/register", async (req, res) => {
    try {
        const encryptedPassword = await CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: encryptedPassword
        })
        await newUser.save();
        res.status(200).json("successfully saved");
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
})
//login with username and password
router.post("/login", async (req, res) => {

    try {
        const user=await User.findOne({username:req.body.username});

        !user && res.status(404).json("invalid username");

        



    } catch (error) {
        res.status(500).json(error);
    }

})

module.exports = router