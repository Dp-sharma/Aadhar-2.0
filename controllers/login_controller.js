const Participant = require('../models/participantmodel');
const bcrypt = require('bcrypt');   
const { validationResult } = require('express-validator');

console.log("identifying.....");

const Participant_register = async (req, res, next) => {
    try {
        console.log('Received POST /api/register request');
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: "Errors",
                errors: result.array()
            });
        }

        console.log('Taking data from request');
        const { fullName, email, password } = req.body;
        
        
        const isExists = await Participant.findOne({ email });
        if (isExists) {
            return res.status(400).json({
                success: false,
                msg: 'Email Already Exists!'
            });
        }

        console.log('Hashing the password');
        const hashpassword = await bcrypt.hash(password, 10);
        console.log('Hashing completed');
        
        const newParticipant = new Participant({
            fullName,
            email,
            password: hashpassword
        });
        console.log('Saving the hashed password in user data');
        console.log('Saving the data in the database');
        
        const participantData = await newParticipant.save();

        console.log('Participant Registered');
        res.redirect('/home');
    } catch (error) {
        console.log('An error occurred');
        console.log(error);
        
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}

module.exports = {
    Participant_register,
};

console.log("hello");
