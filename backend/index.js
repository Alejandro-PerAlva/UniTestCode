const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

/**
 * REGLA 1: Puerto 7777 según guía CodeTest
 */
const PORT = 7777; 

app.use(cors()); 
app.use(express.json());

// --- VERIFICACIÓN DE BASE DE DATOS ---
const DB_PATH = path.resolve(__dirname, 'data', 'db.json');

if (fs.existsSync(DB_PATH)) {
    try {
        const dbData = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        const numExercises = dbData.exercises ? dbData.exercises.length : 0;
        console.log(`✅ Base de datos cargada: ${numExercises} ejercicios.`);
    } catch (err) {
        console.error('❌ Error crítico: db.json tiene un formato JSON inválido.');
    }
} else {
    console.error('❌ ERROR: No existe el archivo en: ' + DB_PATH);
}

/**
 * REGLA 2: Rutas de la API
 * Nginx redirige https://codetest.iaas.ull.es/tfgapa/ -> localhost:7777/
 * Por lo tanto, tus rutas aquí NO necesitan el prefijo /tfgapa/
 */
app.use('/api/evaluador', require('./routes/submissionRoutes'));
app.use('/api/exercises', require('./routes/exerciseRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Ruta de salud para comprobar que el backend responde tras el proxy
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend funcionando en puerto 7777' });
});

/**
 * REGLA 3: Los estáticos NO se sirven aquí.
 * La guía dice que Nginx usará /tfgapaST/ para servir /home/alejandro/static/tfgapaST/
 */
console.log('📢 Configuración: Node solo maneja la API. Nginx maneja los archivos estáticos.');

// --- ARRANCAR SERVIDOR ---
// Escuchamos en '0.0.0.0' o 'localhost'. '0.0.0.0' es más seguro en entornos locales de red.
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n=========================================`);
    console.log(`🚀 SERVIDOR LISTO PARA EL DESPLIEGUE`);
    console.log(`🏠 Puerto local: ${PORT}`);
    console.log(`🌐 URL Pública: https://codetest.iaas.ull.es/tfgapa/`);
    console.log(`📂 Carpeta Estáticos: /home/alejandro/static/tfgapaST/`);
    console.log(`=========================================\n`);
});