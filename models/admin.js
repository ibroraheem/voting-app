const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
        default: 'admin'
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    }, {timestamps: true}
)

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin