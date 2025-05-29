const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
let users = require("./general.js").users; // shared user list from general.js


const regd_users = express.Router();

const isValid = (username)=>{ 
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password)=>{ 
    return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    const accessToken = jwt.sign({ username }, 'fingerprint_customer', { expiresIn: '1h' });

    req.session.authorization = {
        accessToken,
        username
    };

    return res.status(200).json({ message: "User logged in successfully." });
});

// Add a book review (Task 8 placeholder)
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
  
    // Get username from session
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review text is required as a query parameter" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Add or update review
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({ message: "Review added/modified successfully", reviews: books[isbn].reviews });
  });

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "You have not submitted a review for this book" });
    }
  
    delete books[isbn].reviews[username];
  
    return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
