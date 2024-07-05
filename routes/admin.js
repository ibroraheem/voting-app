const express = require('express');
const router = express.Router();

const {register, login} = require('../controllers/adminAuth')
const {getAllUsers, getUser, deleteUser, addCandidate, getCandidate, getCandidates, reset } = require('../controllers/adminControl')

router.post('/register', register)
router.post('/login', login)
router.get('/users', getAllUsers)
router.get('/users/:id', getUser)
router.delete('/users/:id', deleteUser)
router.post('/candidate', addCandidate)
router.get('/candidate/:id', getCandidate)
router.get('/candidates', getCandidates)
router.post('/reset', reset)


module.exports = router;