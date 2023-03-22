const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body["username"];
  const password = req.body["password"];
  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res.send("User registered successfully");
    } else {
      return res.send("User name is already taken");
    }
  } else {
    return res.status(404).send("Error in registering the user");
  }
});

// Get the book list available in the
public_users.get("/", async function (req, res) {
  const titles = await new Promise((resolve, reject) => resolve(Object.values(books).map((book) => book['title']))
  );
  return res.send(JSON.stringify(titles, null, 4)); 
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  let collected_books = await new Promise(resolve=> books[Number(isbn)])
  if (collected_books) {
    return res.send(JSON.stringify(collected_books, null, 4));
  } else {
    return res.status(404).send("Book not Found");
  }
});

// Get book details based on author
public_users.get("/author/:author",async function (req, res) {
  const author = req.params.author;
  const author_books = await new Promise((resolve, reject)=>{
    const book_array = Object.entries(books);
    resolve(book_array.filter(
      (book) => book[1]["author"] === author
    ));
  });
  if (author_books.length > 0) {
    return res.send(JSON.stringify(author_books, null, 4));
  }
  return res.status(404).send("No Books Found");
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  const book_names = await new Promise((resolve, reject)=>{
    const book_array = Object.entries(books);
    resolve(book_array.filter((book) => book[1]["title"] === title));
  });
  if (book_names.length > 0) {
    return res.send(JSON.stringify(book_names, null, 4));
  }
  return res.status(404).send("No Books Found");
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  let reviews = book["reviews"];
  if (Object.entries(reviews).length > 0) {
    return res.status(200).send(JSON.stringify(reviews, null, 4));
  }
  return res.send("No Review Recorded");
});

module.exports.general = public_users;
