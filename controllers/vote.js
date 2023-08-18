const User = require('../models/user')
const Candidate = require('../models/candidate')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const generateOtp = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.status(400).json({ message: 'No token provided' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded.id })
        if (!user) return res.status(400).json({ message: 'User does not exist' })
        const votingOtp = Math.floor(100000 + Math.random() * 900000).toString()
        const votingOtpExpires = Date.now() + 3600000
        user.votingOtp = votingOtp
        user.votingOtpExpires = votingOtpExpires
        await user.save()
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Voting OTP',
            html: `<p>Hi ${user.firstName},</p></p><p><strong>Your voting OTP is ${votingOtp}</strong></p>`
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
                res.status(500).json({ message: err.message })
            } else {
                console.log(info)
                res.status(200).json({ message: 'OTP sent successfully' })
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const verifyVotingOtp = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.status(400).json({ message: 'No token provided' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded.id })
        if (!user) return res.status(400).json({ message: 'User does not exist' })
        if (user.votingOtp != req.body.otp) return res.status(400).json({ message: 'Invalid OTP' })
        if (user.votingOtpExpires < Date.now()) return res.status(400).json({ message: 'OTP has expired' })
        user.votingOtp = null
        user.votingOtpExpires = null
        user.isAccredited = true
        await user.save()
        const newToken = jwt.sign({ id: user._id, matric: user.matric, voted: user.voted, department: user.department, level: user.level, isVerified: user.isVerified, role: user.role, isAccredited: user.isAccredited }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({ message: 'OTP verified successfully', token: newToken })
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
        const user = await User.findOne({ _id: decoded.id })
        if (!user) return res.status(400).json({ message: 'User does not exist' })
        if (!user.isAccredited) return res.status(400).json({ message: 'User is not accredited' })
        if (user.hasVoted) return res.status(400).json({ message: 'User has already voted' })
        const candidates = await Candidate.find({ post: { $ne: 'SRC' } })
        let src = await Candidate.find({ post: 'SRC', department: { $eq: user.department } })
        res.status(200).json({ candidates, src })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}


const vote = async (req, res) => {
    try {
        const { ballot } = req.body
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.status(400).json({ message: 'No token provided' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded.id })
        if (!user) return res.status(400).json({ message: 'User does not exist' })
        if (!user.isAccredited) return res.status(400).json({ message: 'User is not accredited' })
        if (user.hasVoted) return res.status(400).json({ message: 'User has already voted' })

        const president = await Candidate.findOne({ _id: ballot.president })
        if (president) {
            president.votes += 1
            await president.save()
        }
        const vicePresident = await Candidate.findOne({ _id: ballot["vice president"] })
        if (vicePresident) {
            vicePresident.votes += 1
            await vicePresident.save()
        }
        const genSec = await Candidate.findOne({ _id: ballot["general secretary"] })
        if (genSec) {
            genSec.votes += 1
            await genSec.save()
        }
        const ags = await Candidate.findOne({ _id: ballot["assistant general secretary"] })
        if (ags) {
            ags.votes += 1
            await ags.save()
        }
        const sportSec = await Candidate.findOne({ _id: ballot["sports secretary"] })
        if (sportSec) {
            sportSec.votes += 1
            await sportSec.save()
        }
        const welfare = await Candidate.findOne({ _id: ballot["welfare secretary"] })
        if (welfare) {
            welfare.votes += 1
            await welfare.save()
        }
        const finSec = await Candidate.findOne({ _id: ballot["financial secretary"] })
        if (finSec) {
            finSec.votes += 1
            await finSec.save()
        }
        const socialSec = await Candidate.findOne({ _id: ballot["social secretary"] })
        if (socialSec) {
            socialSec.votes += 1
            await socialSec.save()
        }
        const pro = await Candidate.findOne({ _id: ballot.pro })
        if (pro) {
            pro.votes += 1
            await pro.save()
        }
        const technical = await Candidate.findOne({ _id: ballot["technical director"] })
        if (technical) {
            technical.votes += 1
    
            await technical.save()
        }
        const src = await Candidate.find({ _id: ballot.src })
        if (src) {
            ballot.src.forEach(async (srcId) => {
                const src = await Candidate.findOne({ _id: srcId })
                if (src) {
                    src.votes += 1
                    await src.save()
                }
            })
        }
        user.hasVoted = true
        await user.save()
        const newToken = jwt.sign({ id: user._id, matric: user.matric, voted: user.voted, department: user.department, level: user.level, isVerified: user.isVerified, role: user.role, isAccredited: user.isAccredited, hasVoted: user.hasVoted }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({ message: 'Voting successful' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = { generateOtp, verifyVotingOtp, vote, getCandidates }

