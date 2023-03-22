const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let collected_books = books[Number(isbn)];
  if (collected_books){
    return res.send(collected_books);
  }
  else{
    return res.status(404).json({message: 'Book not Found'});
}
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const book_array = Object.entries(books);
  const author_books = book_array.filter((book)=>
    book[1]['author'] === author
  );
  if(author_books.length>0){
    return res.send(JSON.stringify(author_books, null, 4));
  }
  return res.status(404).send('No Books Found');
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const book_array = Object.entries(books);
  const book_names = book_array.filter((book)=>
    book[1]['title'] === title
  );
  if(author_books.length>0){
    return res.send(JSON.stringify(author_books, null, 4));
  }
  return res.status(404).send('No Books Found');
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  let reviews = book['reviews'];
  if (reviews){
    return res.status(200).send(JSON.stringify(reviews, null, 4));
  }
  return res.send('No Review Recorded')
});

module.exports.general = public_users;
