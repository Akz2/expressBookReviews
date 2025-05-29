const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let users = [];  // Shared users list for registration and login
const public_users = express.Router();



public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    const userExists = users.find(user => user.username === username);
    if (userExists) {
      return res.status(409).json({ message: "Username already exists." });
    }
  
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully." });
  });  

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
      const getBooks = () => {
        return new Promise((resolve, reject) => {
          // Simulate async operation
          resolve(books);
        });
      };
  
      const bookList = await getBooks();
      return res.status(200).json(bookList);
  
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
  });
  
// Get book details based on ISBN
// Task 11: Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
  
    try {
      const getBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
          const book = books[isbn];
          if (book) {
            resolve(book);
          } else {
            reject(new Error("Book not found for the given ISBN."));
          }
        });
      };
  
      const book = await getBookByISBN(isbn);
      return res.status(200).json(book);
  
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const authorParam = req.params.author.toLowerCase();
  
    try {
      const getBooksByAuthor = (author) => {
        return new Promise((resolve, reject) => {
          const matchingBooks = [];
  
          for (const isbn in books) {
            const book = books[isbn];
            if (book.author.toLowerCase() === author) {
              matchingBooks.push({ isbn, ...book });
            }
          }
  
          if (matchingBooks.length > 0) {
            resolve(matchingBooks);
          } else {
            reject(new Error("No books found for the given author"));
          }
        });
      };
  
      const booksByAuthor = await getBooksByAuthor(authorParam);
      return res.status(200).json(booksByAuthor);
  
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  });

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const titleParam = req.params.title.toLowerCase();
  
    try {
      const getBooksByTitle = (title) => {
        return new Promise((resolve, reject) => {
          const matchingBooks = [];
  
          for (const isbn in books) {
            const book = books[isbn];
            if (book.title.toLowerCase() === title) {
              matchingBooks.push({ isbn, ...book });
            }
          }
  
          if (matchingBooks.length > 0) {
            resolve(matchingBooks);
          } else {
            reject(new Error("No books found for the given title"));
          }
        });
      };
  
      const booksByTitle = await getBooksByTitle(titleParam);
      return res.status(200).json(booksByTitle);
  
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "Book not found for the given ISBN." });
    }
  });

module.exports.general = public_users;
module.exports.users = users;
