const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    surname: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    firstName: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    matric: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    level: {
        type: String,
        required: true,
        enum: ['100', '200', '300', '400', '500']
    },
    department: {
        type: String,
        required: true,
        enum: ['ABE', 'BME', 'CHE', 'CPE', 'CVE', 'ELE', 'FBE', 'MEE', 'MME', 'WRE']
    },
    status: {
        type: String,
        required: true,
        enum: ['verified', 'unverified'],
        default: 'unverified'
    },
    role: {
        type: String,
        required: true,
        default: 'student'
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    otp: {
        type: String,
        required: true,
    },
    otpExpires: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User