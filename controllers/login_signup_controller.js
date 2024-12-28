const Participant = require('../models/participantmodel');
const bcrypt = require('bcrypt');   
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


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
                msg: 'Email Already Exists Please try to login !'
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
        
        await newParticipant.save();

        return res.status(200).json({
            success: true,
            msg: 'Participant Registered',
            redirectUrl: '/'
        });
        
    } catch (error) {
        console.log('An error occurred');
        console.log(error);
        
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}

const generateAccessToken = async (user) => {
    console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);  // Log the secret key
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" });
    return token;
};
const Participant_login = async(req,res, next)=>{
    try {
        
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                success:false,
                msg:"Errors",
                errors: errors.array()
            })
        } 
        console.log('Getting data from the body');
        const { email, password } = req.body;
        console.log('Finding the data in database');
        const participantData = await Participant.findOne({ email });
        console.log(participantData)
        if(!participantData){
            return res.status(401).json({
                success: false,
                msg: 'Email is Incorrect!'
            });
        }
        console.log('Comparing the password');
        const passwordMatch = await bcrypt.compare(password, participantData.password);

        if(!passwordMatch){
            return res.status(401).json({
                success: false,
                msg: 'Password is Incorrect!'
            });
        }
        console.log('Generating the token');
        const accessToken = await generateAccessToken({ user:participantData });

        res.cookie("jwtoken",accessToken,{
            expires:new Date(Date.now()+2340000000),
            httpOnly:true
        })
        console.log('Participant logged in')
        res.redirect('/');
        
    
    } catch (error) {
        console.log('This is last error')
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}
module.exports = {
    Participant_register,
    Participant_login,
};


