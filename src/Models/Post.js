const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        max: 500
    },
    likes: {
        type: Array,
        default: []
    }
},
    {
        timestamps: true
    });

//export the model so you can use on other files  
module.exports = mongoose.model("Post", PostSchema);