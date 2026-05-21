// Defines routes for category CRUD operations.
// GET is open to all authenticated users.
const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/category.controller')
const authenticate = require('../middleware/auth.middleware')
const isAdmin = require('../middleware/admin.middleware')

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/', authenticate, categoryController.getAll)

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a single category by ID
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
 *         description: Category found
 */
router.get('/:id', authenticate, categoryController.getOne)

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/', authenticate, isAdmin, categoryController.create)

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category (admin only)
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
 *         description: Category updated
 */
router.put('/:id', authenticate, isAdmin, categoryController.update)

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category (admin only)
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
 *         description: Category deleted
 */
router.delete('/:id', authenticate, isAdmin, categoryController.remove);


module.exports = router;