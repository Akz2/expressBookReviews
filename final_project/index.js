const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;


const app = express();

app.use(express.json());

// Setup express-session middleware for customer routes
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// JWT authentication middleware for protected customer auth routes
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session && req.session.authorization) {
        const token = req.session.authorization.accessToken;

        jwt.verify(token, "fingerprint_customer", (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            } else {
                req.user = user;
                next();
            }
        });
    } else {
        return res.status(403).json({ message: "User not authenticated" });
    }
});

const PORT = 5000;

// Mount route files
app.use("/customer", customer_routes);  // login, review, etc.
app.use("/", genl_routes);              // public routes like /register, /isbn/:isbn

// Start server
app.listen(PORT, () => console.log("Server is running"));
