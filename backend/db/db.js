const mongoose = require('mongoose')
const url = "mongodb+srv://mrrobot:mrrobot@empmngmt.cs734kp.mongodb.net/test-3?retryWrites=true&w=majority"

const connect = () => {
    mongoose.connect(url, {
        useNewUrlParser : true, useUnifiedTopology: true
    });
    console.log("Connected to database...");
}

module.exports = connect;