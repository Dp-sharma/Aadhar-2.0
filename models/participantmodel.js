const mongoose = require('mongoose');

const participantSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true, // Full name is mandatory
        trim: true
    },
    email: {
        type: String,
        required: true, // Email is mandatory
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true, // Password is mandatory
    },
    rollNo: {
        type: String,
        trim: true
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['Mr.', 'Mrs.'], // Gender now accepts 'Mr.' and 'Mrs.'
    },
    year: {
        type: String,
        enum: ['1st', '2nd'], // Allowing only '1st' and '2nd' for year
    },
    branch: {
        type: String,
        trim: true
    },
    section: {
        type: String,
        trim: true
    },
    mobileNo: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['General', 'OBC', 'SC', 'ST', 'Other'],
    },
    TeamName:{
        type: String,
        trim: true,
        
    },
    googleDriveLink: {
        type: String,
        trim: true,
        validate: {
            validator: function(value) {
                return /^(https:\/\/drive\.google\.com\/.*)/.test(value); // Simple validation for Google Drive URL
            },
            message: props => `${props.value} is not a valid Google Drive link!`
        },
    },
    finalReportLink: {
        type: String,
        trim: true,
        validate: {
            validator: function(value) {
                return /^(https?:\/\/[^\s$.?#].[^\s]*)/.test(value); // General URL validation
            },
            message: props => `${props.value} is not a valid URL!`
        },
    },

    // New Team Member Field (Array of Objects, optional fields for team members)
    teamMembers: [{
        fullName: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            lowercase: true
        },
        rollNo: {
            type: String,
            trim: true
        },
        dob: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ['Mr.', 'Mrs.'], // Gender now accepts 'Mr.' and 'Mrs.' for team members
        },
        year: {
            type: String,
            enum: ['1st', '2nd'], // '1st' and '2nd' allowed for team members
        },
        branch: {
            type: String,
            trim: true
        },
        section: {
            type: String,
            trim: true
        },
        mobileNo: {
            type: String,
            trim: true
        },
        category: {
            type: String,
            enum: ['General', 'OBC', 'SC', 'ST', 'Other'],
        }
    }]

}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model("Participant", participantSchema);
