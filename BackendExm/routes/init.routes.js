// Defines the route for the init endpoint.
// This endpoint populates the database with initial data.

const express = require('express')
const router = express.Router();
const initController = require('../controllers/init.controller')

/**
 * @swagger
 * /init:
 * 
 *   post:
 *     summary: Initialize the DB with seed data
 *     description: Populates the DB with roles, admin user, memberships and products from Noroff API.
 * 
 *     responses: 
 *       200 = description: DB initialized successfully
 *       500 = description: Initialization failed
 */
router.post('/', initController.initDatabase);

module.exports = router;
