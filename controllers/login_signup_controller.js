const Participant = require('../models/participantmodel');
const bcrypt = require('bcrypt');   
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist');


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
        
        const participantData = await newParticipant.save();
        req.participant = participantData
        console.log(participantData);
        
        const accessToken = await generateAccessToken({ user:participantData });

        res.cookie("jwtoken",accessToken,{
            expires:new Date(Date.now()+2340000000),
            httpOnly:true
        })

        return res.status(200).json({
            success: true,
            msg: 'Participant Registered',
            redirectUrl: '/login'
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
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "48h" });
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
        console.log("This is the participant Data from login Controller",participantData)
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
        // res.redirect('/profile');
        res.status(200).json({
            success: true,
            msg: 'Login successful!',
            token: accessToken,
            redirectUrl: '/profile',
        });
        
    
    } catch (error) {
        console.log('This is last error')
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}
const Participant_logout = async(req, res) =>{
    try{

        const token = req.cookies.jwtoken ;

        if (!token) {
            res.status(400).json({
                success:false,
                msg:"you are already logged out"
            })
        }
        // const bearer = token.split(' ');
        // const bearerToken = bearer[1];

        const newBlacklist = new Blacklist({
            token:token
        });

        await newBlacklist.save();

        res.clearCookie('jwtoken', { path: '/' });

        // res.setHeader('Clear-Site-Data', '"cookies","storage"');
        console.log('your are logged out')

        res.redirect('/login')
        // return res.status(200).json({
        //     success: true,
        //     msg: 'You are logged out!'
        // });

    }catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}

const teamName = async (req, res) => {
    try {
        // Get the team name from the request body
        const TeamName = req.body.teamName; // Match the case to the schema field
        const participantData = req.participant;

        console.log("this is the participant object:");
        console.log(participantData);

        console.log("This is the team name:");
        console.log(TeamName);
        const existingTeam = await Participant.findOne({ TeamName });
        if (existingTeam) {
            return res.status(400).json({
                success: false,
                msg: 'Team name is already taken. Please choose another name.',
            });
        }
        // Update the participant's TeamName field in the database
        const updatedParticipantData = await Participant.findByIdAndUpdate(
            participantData._id, 
            {TeamName, 
                googleDriveLink: '', 
                finalReportLink: '' }, 
            { new: true }
        );

        console.log(updatedParticipantData); // Log the updated participant data
        console.log(TeamName); // Log the updated team name
        
        // return res.status(200).json({
        //     success: true,
        //     msg: 'Team Name Updated',
        //     data: updatedParticipantData,
        // });
        return res.status(200).json({
            success: true,
            msg: 'Team Name Registered Successfully',
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'An error occurred while updating the team name',
            error: error.message,
        });
    }
};
const prototypelink = async (req, res) => {
    try {
        // Get the team name from the request body
        const googleDriveLink= req.body.prototype_link; // Match the case to the schema field
        const participantData = req.participant;

        console.log("this is the participant object:");
        console.log(participantData);

        console.log("This is the googleDriveLink");
        console.log(googleDriveLink);
        // const existingTeam = await Participant.findOne({ TeamName });
        // if (existingTeam) {
        //     return res.status(400).json({
        //         success: false,
        //         msg: 'Team name is already taken. Please choose another name.',
        //     });
        // }
        // Update the participant's TeamName field in the database
        const updatedParticipantData = await Participant.findByIdAndUpdate(
            participantData._id, 
            { googleDriveLink }, 
            { new: true }
        );

        console.log(updatedParticipantData); // Log the updated participant data
        // Log the updated team name
        
        return res.status(200).json({
            success: true,
            msg: 'Prototype Uploaded Successfully',
            data: updatedParticipantData,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'An error occurred while updating the team name',
            error: error.message,
        });
    }
};
const finalreport = async (req, res) => {
    try {
        // Get the team name from the request body
        const finalReportLink= req.body.Final_Report_link; // Match the case to the schema field
        const participantData = req.participant;

        console.log("this is the participant object:");
        console.log(participantData);

        console.log("This is the finalReportLink");
        console.log(finalReportLink);
        // const existingTeam = await Participant.findOne({ TeamName });
        // if (existingTeam) {
        //     return res.status(400).json({
        //         success: false,
        //         msg: 'Team name is already taken. Please choose another name.',
        //     });
        // }
        // Update the participant's TeamName field in the database
        const updatedParticipantData = await Participant.findByIdAndUpdate(
            participantData._id, 
            { finalReportLink }, 
            { new: true }
        );

        console.log(updatedParticipantData); // Log the updated participant data
        // Log the updated team name
        
        return res.status(200).json({
            success: true,
            msg: 'Final Report Submitted Successfully',
            data: updatedParticipantData,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'An error occurred while updating the team name',
            error: error.message,
        });
    }
};

module.exports = {

    Participant_register,
    Participant_login,
    Participant_logout,
    teamName,
    prototypelink,
    finalreport,
};


