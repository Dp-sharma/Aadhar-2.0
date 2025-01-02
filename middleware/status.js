const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist');
const participantmodel = require('../models/participantmodel');

const Status = async (req, res, next) => {
    const token = req.cookies.jwtoken;

    if (!token) {
        return res.redirect('/login'); // Redirect if no token, and return immediately
    }

    try {
        // Check if the token is blacklisted
        const Blacklistedtoken = await Blacklist.findOne({ token });
        if (Blacklistedtoken) {
            console.log('Your token has been blacklisted');
            return res.redirect('/login'); // Redirect if the token is blacklisted
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('user', decoded);
        
        
        // Check if the teamName exists
        if (decoded.user.TeamName) {
            console.log('Team found:', decoded.user.TeamName);
            req.registrationStatus = true; // Set registration status to true
            req.registrationStatusTeamName = "Done"; // Set registration status to true
            console.log("Status is true");
            
        } else {
            console.log('Team not found');
            req.registrationStatus = false; // Set registration status to false
        }
         // Check if the GoogleDriveLink exists
         if (decoded.user.googleDriveLink) {
            console.log('Google Drive Link found:', decoded.user.googleDriveLink);
            req.driveStatus = true; // Set drive status to true
        } else {
            console.log('Google Drive Link not found');
            req.driveStatus = false; // Set drive status to false
        }

        // Check if the FinalReport exists
        if (decoded.user.finalReportLink) {
            console.log('Final Report found:', decoded.user.finalReportLink);
            req.reportStatus = true; // Set report status to true
        } else {
            console.log('Final Report not found');
            req.reportStatus = false; // Set report status to false
        }

         // Attach user info to the request object
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

module.exports = Status;
