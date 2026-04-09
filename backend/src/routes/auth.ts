/**
 * @module AuthRoutes
 * Defines the Express router for authentication and registration endpoints.
 * * Endpoints:
 * - POST /register : Creates a new user with an invitation code
 * - POST /login    : Authenticates a user and returns a JWT
 */

import { Router } from 'express';
import { login, register } from '../controllers/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;