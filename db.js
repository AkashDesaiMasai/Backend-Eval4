const mongoose = require("mongoose")
require('dotenv').config()
const URL = process.env.MONGOOSE_URL;
const connection = mongoose.connect('mongodb+srv://akashdesai3105:akash3105@cluster0.mksequa.mongodb.net/Eval4Async');
if(connection){
    console.log("connected");
}

module.exports ={connection}