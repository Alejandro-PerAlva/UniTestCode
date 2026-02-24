const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const fs = require('fs');

// FORZAMOS LA RUTA AL ARCHIVO QUE ME HAS DICHO
// process.cwd() apunta a C:\Users\Alejandro\Documents\TFG-Unitestcode\backend
const dbPath = path.join(process.cwd(), 'data', 'db.json');

console.log('🔍 Intentando cargar base de datos desde:', dbPath);

// Verificación de seguridad: ¿Existe el archivo realmente?
if (!fs.existsSync(dbPath)) {
    console.log('⚠️ ADVERTENCIA: No se encontró el archivo db.json en la ruta especificada.');
    // Si no existe, creamos la carpeta data para evitar errores
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const adapter = new FileSync(dbPath);
const db = low(adapter);

// Solo escribe valores por defecto SI la base de datos está totalmente vacía
// Esto evita que sobrescriba tus datos actuales
db.defaults({ 
    exercises: [], 
    users: [], 
    submissions: [] 
}).write();

module.exports = db;