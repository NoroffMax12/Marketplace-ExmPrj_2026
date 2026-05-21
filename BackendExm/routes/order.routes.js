// Defines routes for order operations.
// Users can view their orders  but only admins can change order status.
const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order.controller')
const authenticate = require('../middleware/auth.middleware')
const isAdmin = require('../middleware/admin.middleware')

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (admin sees all, user sees own)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get('/', authenticate, orderController.getAll)

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a single order with items
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order found
 */
router.get('/:id', authenticate, orderController.getOne)

/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     summary: Update order status (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.patch('/:id', authenticate, isAdmin, orderController.updateStatus)

module.exports = router;