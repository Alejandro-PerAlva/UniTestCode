/**
 * seed.js
 * Database Seeding Utility.
 * Resets the JSON database to a default state with sample data.
 */
const db = require('./config/jsonDb');
const path = require('path');

console.log('🌱 Seeding local JSON database...');

// 1. Clear existing data to avoid duplicates
db.set('exercises', []).write();
// Note: We usually don't clear users to avoid locking ourselves out, 
// but you can if you want a full reset:
// db.set('users', []).write();

// 2. Define a core sample exercise
// We use the new standardized English keys: masterPath, functionName, etc.
const sampleExercise = {
    id: "exercise_001",
    title: "Double of a Number",
    description: "Implement a function that receives an integer in $a0 and returns its double in $v0.",
    masterPath: "exercises/repo/sample_master.s",
    config: {
        functionName: "calculate_double",
        endLabel: "_fin",
        timeout: 2000,
        inputs: ["10"],
        expectedOutput: "20"
    },
    visible: true,
    createdAt: new Date().toISOString()
};

// 3. Persist sample data
db.get('exercises')
  .push(sampleExercise)
  .write();

console.log('✅ Sample exercise saved to db.json');
console.log('🚀 Database is now synchronized with the new English standard.');