const express = require('express')
const router = express.Router()
const userController = require('../app/controller/UserController')

router.put('/:id/update/member', userController.updateMember)
router.put('/:id/update/password', userController.updatePassword)

module.exports = router