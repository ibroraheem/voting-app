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
        res.status(200).json({ message: 'OTP verified successfully' })
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
        //get all candidates except candidates with post of SRC
        const candidates = await Candidate.find({ post: { $ne: 'SRC' } })
        const src = await Candidate.find({ post: 'SRC', department: user.department })
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
            president.voters.push(user.matric)
            await president.save()
        }
        const vicePresident = await Candidate.findOne({ _id: ballot.vicePresident })
        if (vicePresident) {
            vicePresident.votes += 1
            vicePresident.voters.push(user.matric)
            await vicePresident.save()
        }
        const genSec = await Candidate.findOne({ _id: ballot.genSec })
        if (genSec) {
            genSec.votes += 1
            genSec.voters.push(user.matric)
            await genSec.save()
        }
        const ags = await Candidate.findOne({ _id: ballot.ags })
        if (ags) {
            ags.votes += 1
            ags.voters.push(user.matric)
            await ags.save()
        }
        const sportSec = await Candidate.findOne({ _id: ballot.sportSec })
        if (sportSec) {
            sportSec.votes += 1
            sportSec.voters.push(user.matric)
            await sportSec.save()
        }
        const welfare = await Candidate.findOne({ _id: ballot.welfare })
        if (welfare) {
            welfare.votes += 1
            welfare.voters.push(user.matric)
            await welfare.save()
        }
        const finSec = await Candidate.findOne({ _id: ballot.finSec })
        if (finSec) {
            finSec.votes += 1
            finSec.voters.push(user.matric)
            await finSec.save()
        }
        const socialSec = await Candidate.findOne({ _id: ballot.socialSec })
        if (socialSec) {
            socialSec.votes += 1
            socialSec.voters.push(user.matric)
            await socialSec.save()
        }
        const pro = await Candidate.findOne({ _id: ballot.pro })
        if (pro) {
            pro.votes += 1
            pro.voters.push(user.matric)
            await pro.save()
        }
        const technical = await Candidate.findOne({ _id: ballot.technical })
        if (technical) {
            technical.votes += 1
            technical.voters.push(user.matric)
            await technical.save()
        }
        const src = await Candidate.find({ _id: ballot.src })
        if (src) {
            ballot.src.forEach(async (srcId) => {
                const src = await Candidate.findOne({ _id: srcId })
                if (src) {
                    src.votes += 1
                    src.voters.push(user.matric)
                    await src.save()
                }
            })
        }
        user.hasVoted = true
        await user.save()
        res.status(200).json({ message: 'Voting successful' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = { generateOtp, verifyVotingOtp, vote, getCandidates }

