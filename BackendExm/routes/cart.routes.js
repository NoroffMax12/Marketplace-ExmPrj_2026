// Defines routes for cart operations.
const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cart.controller')
const authenticate = require('../middleware/auth.middleware')

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the active cart for the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart found
 */
router.get('/', authenticate, cartController.getCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add a product to the cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product added to cart
 */
router.post('/', authenticate, cartController.addItem);

/**
 * @swagger
 * /cart/{itemId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed
 */
router.delete('/:itemId', authenticate, cartController.removeItem)

/**
 * @swagger
 * /cart/checkout/now:
 *   post:
 *     summary: Checkout the cart and create an order
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created
 */
router.post('/checkout/now', authenticate, cartController.checkout)

module.exports = router;