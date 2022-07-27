const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    title: {
        type:String,
        required:true,
    },
    content: {
        type:String,
        required:true,
    },
    image: {
        type: String,
        required: true
    },
    creator: {
        type: Object,
        ref:"User",
        required: true
    }
})

module.exports = mongoose.model('Post', postSchema);