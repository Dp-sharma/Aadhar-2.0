const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist');

const authenticateToken = async (req, res, next) => {
    const token = req.cookies.jwtoken;

    if (!token) {
        return res.redirect('/login'); // Redirect if no token, and return immediately
    }

    try {
        const Blacklistedtoken = await Blacklist.findOne({ token });
        if (Blacklistedtoken) {
            console.log('Your token has been blacklisted');
            return res.redirect('/login'); // Redirect if the token is blacklisted
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('user', decoded.user);
        req.participant = decoded.user; // Attach user info to the request object
        return next(); // Proceed to the next middleware or route handler

    } catch (error) {
        // Check if the error is a TokenExpiredError
        if (error.name === 'TokenExpiredError') {
            console.error('Token expired:', error);
            return res.redirect('/login'); // Redirect to login if the token is expired
        }

        // For any other errors, respond with a generic message
        console.error(error);
        return res.status(401).json({ success: false, msg: 'Invalid or expired token.' });
    }
};

module.exports = authenticateToken;
