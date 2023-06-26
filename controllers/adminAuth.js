const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')

const register = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await Admin.findOne({ email })
        if (admin) return res.status(400).json({ message: 'Admin already exists' })
        const hashedPassword = await bcrypt.hash(password, 10)
        const newAdmin = new Admin({
            email,
            password: hashedPassword
        })
        await newAdmin.save()
        res.status(201).json({ message: 'Admin created successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await Admin.findOne({ email })
        if (!admin) return res.status(400).json({ message: 'Admin does not exist' })
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET)
        res.status(200).json({ token, email: admin.email })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = { register, login }