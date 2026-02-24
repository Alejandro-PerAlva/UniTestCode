/**
 * authRoutes.js
 * Routes for user authentication (Login and Registration).
 * Base path: /api/auth
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT token
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public (or restricted based on system policy)
 */
router.post('/register', authController.register);

module.exports = router;