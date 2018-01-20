const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const UserController = require('../controllers/users')

router.post('/signup', UserController.signup)

router.get('/', UserController.get_all)

router.post('/login', UserController.login)

router.get('/:userId', UserController.get)

router.delete('/:userId', checkAuth, UserController.delete)

module.exports = router
