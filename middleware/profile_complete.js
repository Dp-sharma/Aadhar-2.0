const jwt = require('jsonwebtoken')
const Blacklist = require('../models/blacklist')


const profile_complete = async(req, res, next) => {
    const token = req.cookies.jwtoken;
    
    if (!token) {
        console.log('No token, redirecting to login')
        //next();
        res.redirect('/login')
    }
    else{
        const Blacklistedtoken = await Blacklist.findOne({token})
    if (Blacklistedtoken) {

        console.log('your are logged out')
        res.redirect('/login')
    }
    else{
        try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        contact  = decoded.user.mobileNo; // Attach user info to the request object
        if (contact) {
            res.redirect('/prototype');
        } 
        else{
            next();
        }
        //next();
          // Proceed to the next middleware or route handler
        //res.redirect('/myprofile')
    } catch (error) {
        return res.status(401).json({ success: false, msg: 'Invalid token.' });
    }
    }
    }
    
    
};

module.exports = profile_complete;