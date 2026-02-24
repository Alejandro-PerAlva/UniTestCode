const { execSync, spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Cargamos el .env para leer el puerto dinámicamente
require('dotenv').config();

const frontendDir = path.resolve(__dirname, '../frontend');
const distSource = path.join(frontendDir, 'dist');
const distTarget = path.join(__dirname, 'dist');

// Puerto dinámico del .env
const PORT = process.env.PORT || 5000;

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

async function start() {
    try {
        console.log('🧼 [1/4] Limpiando compilaciones anteriores...');
        [distSource, distTarget].forEach(d => {
            if (fs.existsSync(d)) fs.rmSync(d, { recursive: true, force: true });
        });

        console.log('📦 [2/4] Compilando Frontend fresco con Vite...');
        execSync('npm run build', { cwd: frontendDir, stdio: 'inherit', shell: true });

        console.log('🚚 [3/4] Moviendo archivos al servidor...');
        if (fs.existsSync(distSource)) {
            copyRecursiveSync(distSource, distTarget);
            console.log('✅ Sincronización completada.');
        } else {
            throw new Error('La carpeta dist no se encontró tras el build.');
        }

        console.log(`🚀 [4/4] Iniciando Backend en puerto ${PORT} y abriendo Chrome...`);
        const url = `http://localhost:${PORT}`;
        
        // Abrir Chrome específicamente
        const chromeCommand = process.platform === 'win32' 
            ? `start chrome ${url}` 
            : `open -a "Google Chrome" ${url}`;

        exec(chromeCommand, (err) => {
            if (err) {
                const fallback = process.platform === 'win32' ? `start ${url}` : `open ${url}`;
                exec(fallback);
            }
        });

        console.log('\n--- LOGS DEL SERVIDOR (No cierres esta ventana) ---\n');

        // INICIAR EL SERVIDOR
        // stdio: 'inherit' es VITAL para que la terminal se mantenga abierta y veas los logs
        spawn('node', ['index.js'], { 
            cwd: __dirname,
            stdio: 'inherit', 
            shell: true 
        });

    } catch (error) {
        console.error('❌ Error fatal:', error.message);
        process.stdin.resume(); // Pausa la terminal para leer el error
    }
}

start();