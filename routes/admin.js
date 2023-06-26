const express = require('express');
const router = express.Router();

const {register, login} = require('../controllers/adminAuth')
const {getUser, getAllUsers, deleteUser} = require('../controllers/adminControl')

router.post('/register', register)
router.post('/login', login)
router.get('/users', getAllUsers)
router.get('/users/:id', getUser)
router.delete('/users/:id', deleteUser)

module.exports = router;