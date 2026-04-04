import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, importUsers } from '../controllers/user.js';
import { requireAuth, requireTeacher } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth as any, requireTeacher as any);

router.get('/', getUsers as any);
router.post('/', createUser as any); // <-- NUEVA RUTA PARA CREAR
router.post('/import', importUsers as any);
router.put('/:id', updateUser as any); // <-- ACTUALIZADA PARA ACEPTAR TODO EL OBJETO
router.delete('/:id', deleteUser as any);

export default router;