/**
 * exerciseRoutes.js
 * Rutas para la gestión de ejercicios y subida de archivos maestros.
 * Ruta base: /api/exercises
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const exerciseController = require('../controllers/exerciseController');

// 1. Configuración de almacenamiento para los archivos .s (MIPS)
const uploadDir = path.join(__dirname, '../exercises/repo'); 
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Genera un nombre único: master_1766519400810.s
        const uniqueName = `master_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

/**
 * @route   GET /api/exercises
 * @desc    Obtener todos los ejercicios
 */
router.get('/', exerciseController.getAllExercises);

/**
 * @route   POST /api/exercises
 * @desc    Crear un nuevo ejercicio con subida de archivo maestro
 * @access  Privado (Admin/Profesor)
 */
router.post('/', upload.single('masterFile'), exerciseController.createExercise);

/**
 * @route   DELETE /api/exercises/:id
 * @desc    Eliminar un ejercicio y su archivo físico
 */
router.delete('/:id', exerciseController.deleteExercise);

/**
 * @route   PATCH /api/exercises/:id
 * @desc    Actualizar detalles del ejercicio (Título, Config, Visibilidad o Archivo)
 */
router.patch('/:id', upload.single('masterFile'), exerciseController.updateExercise);

// Mantenemos esta por compatibilidad si algún componente antiguo la llama, 
// pero redirige al mismo controlador genérico.
router.patch('/:id/visibility', exerciseController.updateExercise);

module.exports = router;