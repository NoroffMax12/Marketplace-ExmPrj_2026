// Defines routes for product CRUD operations.
// Products is open to all users but filters deleted products for non-admins.

const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller')
const authenticate = require('../middleware/auth.middleware')
const isAdmin = require('../middleware/admin.middleware');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products (admins see deleted products too)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products with brand and category names
 */
router.get('/', authenticate, productController.getAll)

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a single product by ID
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
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get('/:id', authenticate, productController.getOne)

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', authenticate, isAdmin, productController.create)

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product (admin only)
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
 *         description: Product updated
 */
router.put('/:id', authenticate, isAdmin, productController.update)

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Soft delete a product (admin only)
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
 *         description: Product deleted
 */
router.delete('/:id', authenticate, isAdmin, productController.remove)

module.exports = router;
