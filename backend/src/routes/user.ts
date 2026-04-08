import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, importUsers } from '../controllers/user.js';
import { requireAuth, requireTeacher } from '../middleware/auth.js';

const router = Router();

// Aplicamos la seguridad a todas las rutas de este archivo
router.use(requireAuth, requireTeacher);

router.get('/', getUsers);
router.post('/', createUser);
router.post('/import', importUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;