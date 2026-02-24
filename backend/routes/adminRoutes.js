/**
 * adminRoutes.js
 * Rutas para tareas administrativas como la gestión de usuarios.
 * Ruta base: /api/admin (definida en el index.js principal)
 */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

/**
 * @route   GET /api/admin/users
 * @desc    Obtener todos los usuarios registrados
 * @access  Privado (Solo Admin)
 */
router.get('/users', adminController.getAllUsers);

/**
 * @route   POST /api/admin/users
 * @desc    Registra una nueva cuenta de estudiante o profesor
 * @access  Privado (Solo Admin)
 */
router.post('/users', adminController.createNewUser);

/**
 * @route   PATCH /api/admin/users/:id
 * @desc    Actualiza los detalles de un usuario existente
 * @access  Privado (Solo Admin)
 */
router.patch('/users/:id', adminController.updateUser);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Elimina un usuario del sistema
 * @access  Privado (Solo Admin)
 */
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;