/**
 * authController.js
 * Controller for user authentication and authorization.
 */
const db = require('../config/jsonDb'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Validates user credentials and returns a JWT token.
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // 1. Find user by email
        const user = db.get('users').find({ email: email.toLowerCase() }).value();
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // 2. Validate Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // 3. Generate JWT Token
        const payload = { 
            user: { 
                id: user.id, 
                role: user.role, 
                name: user.name, // Homogenized to 'name'
                email: user.email
            } 
        };
        
        jwt.sign(
            payload, 
            process.env.JWT_SECRET || "secret_tfg_123_key", 
            { expiresIn: '4h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    success: true,
                    token, 
                    user: payload.user 
                });
            }
        );
    } catch (error) {
        console.error(`[authController][login] Error: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
};

/**
 * Registers a new user. 
 * Note: This can be used for self-registration or as a helper for admin creation.
 */
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    try {
        const normalizedEmail = email.toLowerCase();
        
        // 2. Check if user already exists
        const userExists = db.get('users').find({ email: normalizedEmail }).value();
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // 3. Password Hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create User
        const newUser = {
            id: crypto.randomUUID(),
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: role || 'student',
            createdAt: new Date().toISOString()
        };

        db.get('users').push(newUser).write();

        res.status(201).json({ 
            success: true, 
            message: "User registered successfully" 
        });

    } catch (error) {
        console.error(`[authController][register] Error: ${error.message}`);
        res.status(500).json({ success: false, message: "Error during registration process" });
    }
};