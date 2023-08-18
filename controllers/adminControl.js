const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')
const User = require('../models/user')
const Candidate = require('../models/candidate')


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

const addCandidate = async (req, res) => {
    try{
        const {surname, firstName, matric,  level,  nickname, photo, otherName, post} = req.body
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.status(400).json({ message: 'No token provided' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(400).json({ message: 'Admin does not exist' })
        const candidate = await Candidate.findOne({ nickname })
        if (candidate) return res.status(400).json({ message: 'Candidate already exists' })
        const dept = matric.includes('30ga') ? 'ABE' :
        matric.includes('30gb') ? 'CVE' :
            matric.includes('30gc') ? 'ELE' :
                matric.includes('30gd') ? 'MEE' :
                    matric.includes('30gm') ? 'CHE' :
                        matric.includes('30gn') ? 'MME' :
                            matric.includes('30gq') ? 'WRE' :
                                matric.includes('30gp') ? 'BME' :
                                    matric.includes('30gt') ? 'FBE' :
                                        'CPE';
        const newCandidate = new Candidate({
            surname,
            firstName,
            department: dept,
            level,
            nickname,
            post,
            photo,
            matric,
            otherName
        })
        await newCandidate.save()
        res.status(201).json({ message: 'Candidate created successfully' })  
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const getCandidate = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.status(400).json({ message: 'No token provided' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(400).json({ message: 'Admin does not exist' })
        const candidate = await Candidate.findOne({ _id: req.params.id })
        if (!candidate) return res.status(400).json({ message: 'Candidate does not exist' })
        res.status(200).json({ id: candidate.id, name: candidate.surname.toUpperCase()+',' + ' ' + candidate.firstName, department: candidate.department, level: candidate.level, nickname: candidate.nickname, photo: candidate.photo, otherName: candidate.otherName })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const getCandidates = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.status(400).json({ message: 'No token provided' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(400).json({ message: 'Admin does not exist' })
        const candidate = await Candidate.find()
        res.status(200).json({ candidate })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const reset = async (req, res) => {
    const candidates = await Candidate.find()
    candidates.forEach(candidate => {
        candidate.votes = 0
        candidate.save()
    })
    const users = await User.find()
    users.forEach(user => {
        user.hasVoted = false
        user.save()
    })
    res.status(200).json({message: "Reset done"})
}
module.exports = { getAllUsers, getUser, deleteUser, addCandidate, getCandidate, getCandidates, reset  }


