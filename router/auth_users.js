const { json } = require("express");
const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  let filtered_users = users.filter((user) => user.username === username);
  if (filtered_users.length > 0) {
    return false;
  }
  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  let filtered_users = users.filter(
    (user) => user.username === username && user.password === password
  );
  if (filtered_users.length > 0) {
    return true;
  }
  return false;
};
regd_users.use("/auth", (req, res, next)=>{
  if (req.session.authorization){
    jwt.verify(token, 'access', (err, user)=>{
      if(!err){
        next();
      }
      else{
        return res.status(403).send('User Not Authenticated');
      }
    });
  }else{
    return res.send('User Not logged In');
  }
});

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    if (authenticatedUser(username, password))
    {
      // One Hour valid token
      let access_token = jwt.sign({data:password}, 'access', {expiresIn:60*60});
      req.session['authorization'] = {
        access_token, username
      }
      return res.send('User Logged In');
    }
    else{
      return res.send('User Authentication Failed')
    }
  } else {
    return res.send("Error Logging In");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  if (books[isbn]){
    books[isbn]['reviews'][req.session['authorization'].username] =review;
    return res.status(200).send('Review Added');
  }
  else{
    return res.status(404).send('Book Not Found');
  }

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res)=>{
  const isbn = req.params.isbn;
  const review = books[isbn]['reviews'][req.session['authorization'].username];
  if (review){
  delete books[isbn]['reviews'][req.session['authorization'].username];
  return res.send('Review Deleted');
  }
  else{
    return res.status(404).send('Review Already Deleted')
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
