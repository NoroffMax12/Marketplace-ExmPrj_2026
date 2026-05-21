// Defines route for product search.
// Open to all users; with authentication not being required.
const express = require('express')
const router = express.Router()
const searchController = require('../controllers/search.controller')

/**
 * @swagger
 * /search:
 *   post:
 *     summary: Search for products by name, category or brand
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               brand: { type: string }
 *     responses:
 *       200:
 *         description: Search results
 */
router.post('/', searchController.search)

module.exports = router;