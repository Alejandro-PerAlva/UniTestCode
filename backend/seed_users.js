/**
 * seedUsers.js
 * Database Seeding Utility for Users.
 * Populates the local JSON database with default Admin and Student accounts.
 */
const db = require('./config/jsonDb');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const seedUsers = async () => {
    console.log('🌱 Seeding users...');

    // 1. Password Hashing
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);
    const studentPassword = await bcrypt.hash("student123", salt);

    // 2. Default User Definitions
    const defaultUsers = [
        {
            id: crypto.randomUUID(),
            name: "Admin Professor", // Standardized to 'name'
            email: "admin@mips.com",
            password: adminPassword,
            role: "admin" // Standardized role
        },
        {
            id: crypto.randomUUID(),
            name: "Default Student",
            email: "student@mips.com",
            password: studentPassword,
            role: "student"
        }
    ];

    // 3. Persist to LowDB
    // We overwrite the 'users' collection to ensure a clean state
    db.set('users', defaultUsers).write();
    
    console.log('✅ Users created successfully:');
    console.log('   👨‍🏫 admin@mips.com / admin123');
    console.log('   🎓 student@mips.com / student123');
};

seedUsers();