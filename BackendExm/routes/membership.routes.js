// Defines routes for membership CRUD operations.
// GET is open to all authenticated users.
const express = require('express')
const router = express.Router()
const membershipController = require('../controllers/membership.controller')
const authenticate = require('../middleware/auth.middleware')
const isAdmin = require('../middleware/admin.middleware')

/**
 * @swagger
 * /membership:
 *   get:
 *     summary: Get all membership tiers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of memberships
 */
router.get('/', authenticate, membershipController.getAll)

/**
 * @swagger
 * /membership/{id}:
 *   get:
 *     summary: Get a single membership tier by ID
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
 *         description: Membership found
 */
router.get('/:id', authenticate, membershipController.getOne)

/**
 * @swagger
 * /membership:
 *   post:
 *     summary: Create a new membership tier (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Membership created
 */
router.post('/', authenticate, isAdmin, membershipController.create)

/**
 * @swagger
 * /membership/{id}:
 *   put:
 *     summary: Update a membership tier (admin only)
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
 *         description: Membership updated
 */
router.put('/:id', authenticate, isAdmin, membershipController.update)

/**
 * @swagger
 * /membership/{id}:
 *   delete:
 *     summary: Delete a membership tier (admin only)
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
 *         description: Membership deleted
 */
router.delete('/:id', authenticate, isAdmin, membershipController.remove)

module.exports = router;