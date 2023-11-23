const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["education", "development", "fun", "sports"],
  },
  user: {
    type: String,
    required: true,
  },
});

const TweetModel = mongoose.model("tweets", tweetSchema);
module.exports = {TweetModel};
