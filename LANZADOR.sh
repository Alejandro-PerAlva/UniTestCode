#!/bin/bash

# 1. Obtener la ruta absoluta de la raíz del proyecto
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

clear
echo "=========================================="
echo "   INICIANDO DESPLIEGUE MIPS STUDIO"
echo "=========================================="

# 2. Entrar en la carpeta backend
cd "$PROJECT_ROOT/backend"

# 3. 'exec' hace que la terminal se convierta en el proceso del servidor.
# No se cerrará hasta que tú cierres la ventana o des Ctrl+C.
exec npm run full-start

# Solo llega aquí si hay un error al lanzar npm
if [ $? -ne 0 ]; then
    echo "❌ Error al iniciar. Presiona Enter para salir."
    read
fi