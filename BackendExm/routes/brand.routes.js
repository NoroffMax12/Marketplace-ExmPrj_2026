// Defines routes for brand CRUD operations.
// GET is open to all authenticated users.
const express = require('express')
const router = express.Router()
const brandController = require('../controllers/brand.controller')
const authenticate = require('../middleware/auth.middleware')
const isAdmin = require('../middleware/admin.middleware');

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Get all brands
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of brands
 */
router.get('/', authenticate, brandController.getAll)

/**
 * @swagger
 * /brands/{id}:
 *   get:
 *     summary: Get a single brand by ID
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
 *         description: Brand found
 */
router.get('/:id', authenticate, brandController.getOne)

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: Create a new brand (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Brand created
 */
router.post('/', authenticate, isAdmin, brandController.create)

/**
 * @swagger
 * /brands/{id}:
 *   put:
 *     summary: Update a brand (admin only)
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
 *         description: Brand updated
 */
router.put('/:id', authenticate, isAdmin, brandController.update)

/**
 * @swagger
 * /brands/{id}:
 *   delete:
 *     summary: Delete a brand (admin only)
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
 *         description: Brand deleted
 */
router.delete('/:id', authenticate, isAdmin, brandController.remove)

module.exports = router;