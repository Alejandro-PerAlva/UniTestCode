const db = require('../config/jsonDb');
const path = require('path');
const fs = require('fs');

const cleanupOrphanMasters = () => {
    try {
        const uploadDir = path.join(__dirname, '../exercises/repo');
        if (!fs.existsSync(uploadDir)) return;
        const exercises = db.get('exercises').value() || [];
        const linkedFiles = exercises.map(ex => path.basename(ex.masterPath));

        fs.readdir(uploadDir, (err, files) => {
            if (err) return;
            files.forEach(file => {
                if (file.startsWith('.')) return;
                if (!linkedFiles.includes(file)) {
                    const filePath = path.join(uploadDir, file);
                    fs.unlink(filePath, () => {});
                }
            });
        });
    } catch (error) {}
};

exports.getAllExercises = (req, res) => {
    try {
        const exercises = db.get('exercises').value();
        res.json({ success: true, data: exercises });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching exercises" });
    }
};

exports.createExercise = (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "Master file missing" });

        const { title, description, config } = req.body;
        const parsedConfig = JSON.parse(config || '{}');
        const relativePath = path.relative(path.join(__dirname, '..'), req.file.path);

        const newExercise = {
            id: Date.now().toString(),
            title: title || "Untitled",
            description: description || "",
            masterPath: relativePath,
            config: {
                functionName: parsedConfig.functionName || 'my_function',
                endLabel: parsedConfig.endLabel || '_fin',
                inputs: parsedConfig.inputs || [],
                timeout: parsedConfig.timeout || 2000,
                expectedOutput: parsedConfig.expectedOutput || ""
            },
            createdAt: new Date().toISOString(),
            visible: false // <-- Cambiado a FALSE por defecto
        };

        db.get('exercises').push(newExercise).write();
        res.status(201).json({ success: true, exercise: newExercise });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteExercise = (req, res) => {
    const { id } = req.params;
    const exercise = db.get('exercises').find({ id }).value();
    if (!exercise) return res.status(404).json({ success: false, message: "Not found" });

    try {
        const absolutePath = path.join(__dirname, '..', exercise.masterPath);
        if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
        db.get('exercises').remove({ id }).write();
        cleanupOrphanMasters();
        res.json({ success: true, message: "Deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Delete error" });
    }
};

exports.updateExercise = (req, res) => {
    const { id } = req.params;
    const { title, description, config, visible } = req.body;
    
    try {
        const exercise = db.get('exercises').find({ id }).value();
        if (!exercise) return res.status(404).json({ success: false, message: "Not found" });

        let updates = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (visible !== undefined) updates.visible = (visible === 'true' || visible === true);
        
        if (config) {
            const parsedConfig = JSON.parse(config);
            updates.config = { ...exercise.config, ...parsedConfig };
        }

        // Si se sube un nuevo archivo maestro en la edición
        if (req.file) {
            const oldPath = path.join(__dirname, '..', exercise.masterPath);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            updates.masterPath = path.relative(path.join(__dirname, '..'), req.file.path);
        }

        db.get('exercises').find({ id }).assign(updates).write();
        res.json({ success: true, message: "Updated", data: db.get('exercises').find({ id }).value() });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update error" });
    }
};

cleanupOrphanMasters();