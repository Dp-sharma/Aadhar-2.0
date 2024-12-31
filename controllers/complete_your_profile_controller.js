const Participant = require('../models/participantmodel'); // Import Participant model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Controller to handle updating the participant's profile
const updateProfile = async (req, res) => {
    try {
        // Log the incoming data for debugging
        console.log('Request Body:', req.body);

        // Destructure the participant data from the request body
        const { 
            rollNo,  gender, branch, section, mobileNo, category, year, 
            teamMembers, email
        } = req.body;
        console.log(teamMembers[1]);
        
        // Handle the case where the email is provided
        if (!email) {
            return res.status(400).json({
                success: false,
                msg: 'Email is required to update the profile'
            });
        }

        // Prepare the participant data for update
        let updatedParticipantData = {
            rollNo,
            gender,
            branch,
            section,
            mobileNo,
            category,
            year,
            teamMembers: [] // Initialize the team members array
        };

        // Handle the team member data
        if (teamMembers && Array.isArray(teamMembers) && teamMembers.length > 0) {
            updatedParticipantData.teamMembers = [
                {
                    fullName: teamMembers[0], 
                    email: teamMembers[6],
                    rollNo: teamMembers[1],
                    gender: teamMembers[2],
                    year: teamMembers[3],
                    branch: teamMembers[4],
                    section: teamMembers[5],
                    mobileNo: teamMembers[7],
                    category: teamMembers[8],
                }
            ];
        }

        // Log to check the final structure
        console.log('Updated Participant Data:', updatedParticipantData);

        // Find the participant by email and update the fields
        const updatedParticipant = await Participant.findOneAndUpdate(
            { email: email }, // Find by participant email
            updatedParticipantData,
            { new: true } // Return the updated document
        );

        if (!updatedParticipant) {
            return res.status(404).json({
                success: false,
                msg: 'Participant not found'
            });
        }

        // Clear previous JWT and generate new one
        res.clearCookie('jwtoken');
        console.log('Updated Participant:', updatedParticipant);

        const accessToken = await generateAccessToken(updatedParticipant);
        res.cookie("jwtoken", accessToken, {
            expires: new Date(Date.now() + 2340000000),
            httpOnly: true
        });

        // Send back the updated participant details
        // return res.status(200).json({
        //     success: true,
        //     msg: 'Profile updated successfully',
        //     redirectUrl: '/prototype'
        // });
        // redirect to the /prototype page
        res.redirect('/prototype');
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'An error occurred while updating the profile',
            error: error.message
        });
    }
};

// Function to generate access token
const generateAccessToken = async (user) => {
    console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);  // Log the secret key for debugging

    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }

    // Sanitize the user object to ensure it's a plain object
    const payload = {
        _id: user._id.toString(), // Convert ObjectId to a string
        fullName: user.fullName,
        email: user.email,
        branch: user.branch,
        category: user.category,
        dob: user.dob, // Make sure it's in a valid format
        gender: user.gender,
        mobileNo: user.mobileNo,
        rollNo: user.rollNo,
        section: user.section,
    };

    // Generate the token
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" });
    return token;
};

module.exports = {
    updateProfile
};
