# UnitTestCode

UnitTestCode es una plataforma educativa orientada a la escritura, depuración y evaluación de código ensamblador MIPS. 

El sistema integra un entorno de desarrollo (Web IDE) en el navegador y un evaluador automático basado en el simulador MARS 4.5. El proyecto está estructurado siguiendo principios de Arquitectura Limpia (Clean Architecture) y tipado estricto con TypeScript.

---

## Características Principales

* Web IDE: Editor de código en el navegador utilizando Monaco Editor, con soporte para autoguardado local y resaltado de sintaxis.
* Modo Duelo: Funcionalidad basada en WebSockets que permite la ejecución interactiva del código del alumno frente a la solución de referencia del profesor. Utiliza instancias de terminales virtuales (XTerm.js) para la gestión de entradas y salidas en tiempo real.
* Evaluador Automático: Sistema de procesamiento por lotes para archivos .s. Ejecuta pruebas unitarias en subprocesos aislados, gestionando límites de tiempo de ejecución (Timeouts) y normalizando la sintaxis legacy (SPIM a MARS).
* Control de Acceso (RBAC): Autenticación mediante JWT con roles diferenciados (Alumno y Profesor). El registro de cuentas con privilegios de administración requiere un código de validación de entorno.
* Panel de Administración: Interfaz para la gestión de usuarios, creación de ejercicios, grabación interactiva de casos de prueba (captura de I/O) y operaciones de importación/exportación de datos en formato JSON.

---

## Stack Tecnológico

El proyecto está dividido en dos aplicaciones independientes:

### Frontend (Cliente)
* Core: React 18 + TypeScript
* Build Tool: Vite
* Estilos: Tailwind CSS + Lucide React
* Editor y Terminal: @monaco-editor/react, xterm.js
* Comunicaciones: axios (REST), socket.io-client (WebSockets)
* Patrón de Diseño: Separación de responsabilidades mediante Smart/Dumb Components (lógica delegada a Custom Hooks).

### Backend (Servidor)
* Core: Node.js + Express + TypeScript
* Base de Datos: SQLite gestionado a través de Prisma ORM
* Comunicaciones: Socket.IO
* Seguridad: JWT (jsonwebtoken), Hashing (bcrypt)
* Motor de Ejecución: Módulo child_process de Node.js ejecutando Mars45.jar (Java).

---

## Arquitectura de Directorios

### Frontend (/frontend/src/)
* /components/: Componentes presentacionales puros, organizados por dominio funcional (admin, auth, evaluator, ide, shared).
* /hooks/: Contiene la lógica de estado, reglas de negocio del cliente y conexiones API/Socket.
* /pages/: Componentes de enrutamiento de nivel superior.
* /services/: Clientes configurados para HTTP (api.ts), almacenamiento de sesión (auth.ts) y WebSockets (socket.ts).
* /types/: Definición de interfaces compartidas (DTOs).

### Backend (/backend/src/)
* /controllers/: Controladores de los endpoints HTTP.
* /middleware/: Interceptores de Express para validación de tokens y control de acceso.
* /routes/: Definición y asignación de rutas REST.
* /services/: Lógica de negocio principal (Ej: evaluator.ts para subprocesos, parser.ts para normalización de código MIPS).
* /utils/: Utilidades transversales, como el gestor centralizado de errores.

---

## Requisitos del Sistema

Para desplegar el entorno de desarrollo, el host debe contar con:
* Node.js (v18 o superior)
* npm o yarn
* Java Runtime Environment (JRE) (v8 o superior). Requerido por el motor de ejecución del backend para inicializar el simulador MARS.

---

## Instrucciones de Instalación y Despliegue

1. Clonar el repositorio:
    git clone <url-del-repositorio>
    cd UnitTestCode

2. Configuración del Backend:
    cd backend
    npm install

3. Variables de Entorno (Crea un archivo .env en backend/):
    PORT=5000
    DATABASE_URL="file:./prisma/dev.db"
    JWT_SECRET="<tu_clave_secreta_jwt>"
    REGISTRATION_SECRET="<codigo_registro_profesores>"

4. Sincronizar Base de Datos (SQLite):
    npx prisma db push

5. Inicializar Servidor Backend:
    npm run dev

6. Configuración e Inicialización del Frontend (En una nueva terminal):
    cd frontend
    npm install
    npm run dev

La interfaz de usuario estará accesible por defecto en http://localhost:5173.

---

## Documentación del Código

El código fuente está documentado utilizando el estándar TSDoc. 
Para generar un sitio web estático navegable con la documentación de la API interna y los componentes, se recomienda integrar herramientas como TypeDoc ejecutándolas sobre el directorio src/.