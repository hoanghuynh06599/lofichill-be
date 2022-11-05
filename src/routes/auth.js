const express = require('express')
const router = express.Router()
const authController = require('../app/controller/AuthController')
const verifyToken = require('../app/middleware/verifyToken')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/findUser', authController.findUser)
router.post('/refresh', authController.refresh)
router.post('/logout', verifyToken, authController.logout)

module.exports = router
