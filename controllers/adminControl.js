const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')
const User = require('../models/user')

const getAllUsers = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.status(400).json({ message: 'No token provided' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(400).json({ message: 'Admin does not exist' })
        const user = await User.find()
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.status(400).json({ message: 'No token provided' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(400).json({ message: 'Admin does not exist' })
        const user = await User.findOne({ _id: req.params.id })
        if (!user) return res.status(400).json({ message: 'User does not exist' })
        res.status(200).json({ id: user.id, matric: user.matric, name: user.surname.toUpperCase()+',' + ' ' + user.firstName, department: user.department, level: user.level })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.status(400).json({ message: 'No token provided' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(400).json({ message: 'Admin does not exist' })
        const user = await User.findOne({ _id: req.params.id })
        if (!user) return res.status(400).json({ message: 'User does not exist' })
        await User.deleteOne({ _id: req.params.id })
        res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getAllUsers, getUser, deleteUser }


