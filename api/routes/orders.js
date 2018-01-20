const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const OrderController = require('../controllers/orders')

router.get('/', checkAuth, OrderController.get_all)

router.post('/', checkAuth, OrderController.store)

router.get('/:orderId', checkAuth, OrderController.get)

router.delete('/:orderId', checkAuth, OrderController.delete)

module.exports = router