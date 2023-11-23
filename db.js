const mongoose = require("mongoose")
require('dotenv').config()
const URL = process.env.MONGOOSE_URL;
const connection = mongoose.connect(URL);
if(connection){
    console.log("connected");
}

module.exports ={connection}