const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')
const testUser = require('../middleware/testUser')

const rateLimiter = require('express-rate-limit')
// This code creates a rate limiter that limits the number of requests from a given IP address
// to 10 requests per 15 minutes.
const limiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        msg: 'Too many requests from this IP, please try again in 15 minutes',
    }
})

const { register, login, updateUser } = require('../controllers/auth')
router.post('/register', limiter, register)
router.post('/login', limiter, login)
router.patch('/updateUser', authenticateUser, testUser, updateUser)

module.exports = router
