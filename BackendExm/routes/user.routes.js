// Defines routes for user management.
// Only admins can view and update users.
const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const authenticate = require('../middleware/auth.middleware')
const isAdmin = require('../middleware/admin.middleware')

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', authenticate, isAdmin, userController.getAll)

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user (admin only)
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
 *         description: User updated
 */
router.put('/:id', authenticate, isAdmin, userController.update)

module.exports = router;