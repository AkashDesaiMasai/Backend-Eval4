const express = require("express");
const app = express();
const PORT = 3000;

const { Authentication } = require("./middlewares");

const { connection } = require("./db");
const { UserModel } = require("./models/userModel");
const { TweetModel } = require("./models/tweetModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { name, email, password, gender, country } = req.body;

  bcrypt.hash(password, 10, async function (err, hash) {
    if (err) {
      return res.json({ error: "Hashing error" });
    }
    try {
      const user = new UserModel({
        name,
        email,
        gender,
        country,
        password: hash,
      });
      await user.save();
      res.json(user);
    } catch (err) {
      res.json({ error: "User creation error" });
    }
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    return res.json({ error: "Invalid email or password" });
  }

  const hash = user.password;
  bcrypt.compare(password, hash, function (err, result) {
    if (err || !result) {
      return res.json({ error: "Invalid email or password" });
    }

    var token = jwt.sign({ user_ID: user._id }, "Akash");
    res.json({ message: "Login successful", token });
  });
});

//authorization middleware
app.use(Authentication);

app.get("/tweets", async (req, res) => {
  try {
    const query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }

    const tweets = await TweetModel.find(query);

    res.json(tweets);
  } catch (error) {
    res.json({ error: "Internal server error" });
  }
});

app.post("/tweets/create", (req, res) => {
  const { title, category, body } = req.body;
  const userID = req.userID;
  if (!title || !category || !body) {
    return res.json({ error: "All required fields must be provided" });
  }

  if (
    category !== "education" &&
    category !== "fun" &&
    category !== "sports" &&
    category !== "development"
  ) {
    return res.status(400).json({ error: "Invalid category" });
  }

  const newtweet = new TweetModel({
    title,
    category,
    body,
    user: userID,
  });

  newtweet
    .save()
    .then((tweet) => {
      res.json(tweet);
    })
    .catch((error) => {
      res.json({ error: "Internal server error" });
    });
});
console.log("hello")
app.patch("/tweets/:tweetID", async (req, res) => {
  try {
    const tweetId = req.params.tweetID;
    const updatedData = req.body;
    const userID = req.userID;
    console.log(userID);
    const updatedtweet = await TweetModel.findOneAndUpdate({ _id: tweetId, user: userID },updatedData);

    if (!updatedtweet) {
      // If the tweet doesn't exist, return a 404 Not Found response
      return res.json({ error: "tweet not found" });
    }

    res.json(updatedtweet);
  } catch (error) {
    res.json({ error: "Internal server error" });
  }
});

app.delete("/tweets/:tweetID", async (req, res) => {
  try {
    const tweetId = req.params.tweetID;
    const userID = req.userID;
    const deletedtweet = await TweetModel.findByIdAndDelete({
      _id: tweetId,
      user: userID,
    });

    if (!deletedtweet) {
      return res.json({ error: "tweet not found" });
    }

    res.json({ message: "tweet deleted successfully" });
  } catch (error) {
    res.json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Base Api endpoint" });
});

app.listen(PORT, () => {
  try {
    connection;
    console.log(`Listening on port:${PORT}`);
  } catch (err) {
    console.error(err);
  }
});
