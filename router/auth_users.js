const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let filtered_users = users.filter((user)=>user.name === username);
  if(filtered_users.length>0){
    return false;
  }
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const username = username;
  const password = password;
  let filtered_users = users.filter((user)=> (user.username === username) && (user.password === password));
  if (filtered_users.length>0){
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
