const fs = require("fs");
var jwt = require('jsonwebtoken');
const path = require("path");
const Authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
    .status(401)
    .json({ error: "Unauthorized: Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  
  jwt.verify(token, "Akash", function (err, decoded) {
    if (err) {
      console.log(token)
      return res.send("something went wrong");
    }
    req.userID = decoded.user_ID;
    next();
    
  });
};

module.exports = { Authentication };
