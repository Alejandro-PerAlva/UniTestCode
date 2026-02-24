/**
 * adminController.js
 * Controlador responsable de la gestión administrativa de usuarios.
 */
const db = require('../config/jsonDb');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * Obtener todos los usuarios de la base de datos.
 */
const getAllUsers = (req, res) => {
    try {
        const users = db.get('users').value() || [];
        // Enviamos los usuarios pero SIN la contraseña por seguridad
        const sanitizedUsers = users.map(({ password, ...rest }) => rest);
        res.json({ success: true, data: sanitizedUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};

/**
 * Crea un nuevo usuario (Estudiante o Profesor).
 */
const createNewUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const userExists = db.get('users').find({ email: email.toLowerCase() }).value();
        if (userExists) {
            return res.status(400).json({ success: false, message: "Email is already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            id: crypto.randomUUID(),
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
            createdAt: new Date().toISOString()
        };

        db.get('users').push(newUser).write();

        res.status(201).json({ 
            success: true, 
            message: "User created successfully",
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * Actualiza la información de un usuario existente.
 */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, password } = req.body;

        const user = db.get('users').find({ id }).value();
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let updates = {};
        if (name) updates.name = name;
        if (role) updates.role = role;
        
        // Verificar duplicidad de email si se intenta cambiar
        if (email && email.toLowerCase() !== user.email) {
            const emailTaken = db.get('users').find({ email: email.toLowerCase() }).value();
            if (emailTaken) {
                return res.status(400).json({ success: false, message: "Email is already in use" });
            }
            updates.email = email.toLowerCase();
        }

        // Si se proporciona una contraseña nueva, se encripta
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(password, salt);
        }

        db.get('users').find({ id }).assign(updates).write();

        res.json({ 
            success: true, 
            message: "User updated successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating user" });
    }
};

/**
 * Elimina un usuario por ID.
 * Previene la eliminación del último administrador.
 */
const deleteUser = (req, res) => {
    try {
        const { id } = req.params;
        const userToDelete = db.get('users').find({ id }).value();

        if (!userToDelete) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Seguridad: No permitir borrar al último administrador
        if (userToDelete.role === 'admin') {
            const admins = db.get('users').filter({ role: 'admin' }).value();
            if (admins.length <= 1) {
                return res.status(403).json({ success: false, message: "Cannot delete the last administrator" });
            }
        }

        db.get('users').remove({ id }).write();
        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting user" });
    }
};

module.exports = { 
    createNewUser, 
    getAllUsers, 
    deleteUser,
    updateUser 
};