const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./Routes/users");
const authenticateRoute = require("./Routes/authenticate");
const postRoute = require("./Routes/posts");

//require("dotenv").config({path:"../.env"})
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true }, (err) => {
    if (err) console.log(err)
    else console.log("mongdb is connected");
});


app.use(express.json());
app.use(morgan("common"));
app.use(helmet());

app.use("/users", userRoute);
app.use("/auth", authenticateRoute);
app.use("/posts", postRoute);




app.listen(8800, () => {
    console.log("server started on port 8800");
})