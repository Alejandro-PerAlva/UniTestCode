/**
 * @module UserRoutes
 * Defines the Express router for user administration endpoints.
 * All routes in this module are strictly protected by teacher-level authorization.
 * * Endpoints:
 * - GET    /        : Retrieve a list of all users
 * - POST   /        : Manually create a user account
 * - POST   /import  : Bulk import multiple user accounts
 * - PUT    /:id     : Update a user's details or role
 * - DELETE /:id     : Delete a user account
 */

import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, importUsers } from '../controllers/user.js';
import { requireAuth, requireTeacher } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireTeacher);

router.get('/', getUsers);
router.post('/', createUser);
router.post('/import', importUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;