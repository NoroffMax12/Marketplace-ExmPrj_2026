/*Defines route for recently viewed products. Only accessible to authenticated users.*/
const express = require('express');
const router = express.Router();
const recentlyViewedController = require('../controllers/recentlyviewed.controller');
const authenticate = require('../middleware/auth.middleware');

/**
 * @swagger
 * /recently-viewed:
 *   get:
 *     summary: Get the last 3 products viewed by the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recently viewed products found
 *       404:
 *         description: No recently viewed products found
 */
router.get('/', authenticate, recentlyViewedController.getRecentlyViewed);

module.exports = router;