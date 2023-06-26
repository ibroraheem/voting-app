const express = require('express');
const router = express.Router();

const {register, login, forgotPassword, resetPassword, verify, resendOTP } = require('../controllers/userAuth')

router.post('/register', register)
router.post('/login', login)
router.post('/verify', verify)
router.post('/resend-otp', resendOTP)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router;