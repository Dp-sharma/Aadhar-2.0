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
        enum: ['Male', 'Female', 'Other'],
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
    passOutYear: {
        type: Number,
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model("Participant", participantSchema);
