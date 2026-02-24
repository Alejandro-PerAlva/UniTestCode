const path = require('path');
const fs = require('fs').promises;
const { autoTransplant } = require('../logic/trasplanta');
const { ObtieneRespuesta } = require('../logic/obtienerespuesta');
const db = require('../config/jsonDb');

// Helper para normalizar salidas sin perder mensajes de error
const normalize = (text) => text ? text.toString().trim() : "";

/**
 * Motor de Auditoría de Integridad:
 * Identifica mensajes de error del maestro y limpia el resultado final.
 */
const auditOutput = (rawOutput) => {
    const alerts = [];
    const integrityPhrases = [
        "*** Registro $s0 modificado ***",
        "*** Registro $s1 modificado ***",
        "*** Registro $s2 modificado ***",
        "*** Registro $s3 modificado ***",
        "*** Registro $s4 modificado ***",
        "*** Registro $s5 modificado ***",
        "*** Registro $s6 modificado ***",
        "*** Registro $s7 modificado ***",
        "*** Registro $s8 modificado ***",
        "*** Pila no equilibrada ***",
        "*** Cabecera Pila modificada ***"
    ];

    integrityPhrases.forEach(phrase => {
        if (rawOutput.includes(phrase)) {
            alerts.push(phrase.replace(/\*\*\*/g, '').trim());
        }
    });

    const match = rawOutput.match(/Resultado devuelto:\s*(-?\d+)/);
    const cleanResult = match ? match[1] : rawOutput;

    return { alerts, cleanResult };
};

/**
 * Análisis de Código:
 * Busca en el código del alumno las líneas que manipulan registros conflictivos.
 */
const findGuiltyInstructions = (studentCode, alerts) => {
    const lines = studentCode.split('\n');
    const guilty = [];

    alerts.forEach(alert => {
        const regMatch = alert.match(/\$s[0-8]/);
        if (regMatch) {
            const reg = regMatch[0];
            const instruction = lines.find(l => 
                l.includes(reg) && 
                (l.includes("li") || l.includes("move") || l.includes("add") || l.includes("sub") || l.includes("lw"))
            );
            if (instruction) {
                guilty.push({
                    msg: `Posible manipulación incorrecta de ${reg}`,
                    instruction: instruction.trim()
                });
            }
        }

        if (alert.includes("Pila")) {
            const stackInstruction = lines.find(l => l.includes("$sp"));
            if (stackInstruction) {
                guilty.push({
                    msg: "Revisa la apertura/cierre de la pila",
                    instruction: stackInstruction.trim()
                });
            }
        }
    });
    return guilty;
};

// --- EVALUACIÓN INDIVIDUAL (Para el IDE) ---
exports.evaluateSubmission = async (req, res) => {
    let studentFilePath = req.file ? req.file.path : null;
    let hybridFilePath = null;

    try {
        if (!studentFilePath) return res.status(400).json({ success: false, message: "No source file" });
        
        const { exerciseId } = req.body; 
        const exercise = db.get('exercises').find(ex => String(ex.id) === String(exerciseId)).value();

        if (!exercise) return res.status(404).json({ success: false, message: "Exercise not found" });

        const studentCode = await fs.readFile(studentFilePath, 'utf8');
        const absoluteMasterPath = path.join(__dirname, '..', exercise.masterPath);
        hybridFilePath = await autoTransplant(studentFilePath, absoluteMasterPath, exercise.config.functionName);

        const executor = new ObtieneRespuesta(hybridFilePath, exercise.config.timeout || 3000);
        await executor.preparaEjecutable();
        
        const inputs = Array.isArray(exercise.config.inputs) ? exercise.config.inputs : [exercise.config.inputs];
        const executionResult = await executor.respuesta(inputs);

        const rawOutput = normalize(executionResult.resultado);
        const rawError = normalize(executionResult.error);
        const { alerts, cleanResult } = auditOutput(rawOutput);
        const expectedOutput = normalize(exercise.config.expectedOutput);
        
        // --- CLASIFICACIÓN DE ERRORES ---
        let errorType = null;
        let cleanLogs = rawError;

        // Si el simulador da error (codigo != 0) o hay texto en stderr, es Runtime
        if (executionResult.codigo !== 0 || rawError.length > 0) {
            errorType = "runtime_error";
            // Limpiar rutas de Windows de los logs para seguridad y estética
            cleanLogs = rawError.replace(/[A-Z]:\\.*\.s/gi, "programa.s");
        } else if (cleanResult !== expectedOutput) {
            errorType = "logic_error";
        } else if (alerts.length > 0) {
            errorType = "integrity_error";
        }

        const isCorrect = (executionResult.codigo === 0) && (cleanResult === expectedOutput) && (alerts.length === 0);
        const guiltyInstructions = alerts.length > 0 ? findGuiltyInstructions(studentCode, alerts) : [];

        res.json({
            success: true,
            passed: isCorrect,
            errorType: errorType,
            output: cleanResult,
            expected: expectedOutput,
            integrityAlerts: alerts,
            guiltyInstructions: guiltyInstructions,
            logs: cleanLogs || (alerts.length > 0 ? "Fallo de Integridad" : "OK"),
            details: { exitCode: executionResult.codigo }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    } finally {
        if (studentFilePath) await fs.unlink(studentFilePath).catch(() => {});
        if (hybridFilePath) await fs.unlink(hybridFilePath).catch(() => {});
    }
};

// --- EVALUACIÓN MÚLTIPLE (Batch) ---
exports.evaluateMultipleSubmissions = async (req, res) => {
    let studentFilePath = req.file ? req.file.path : null;
    const results = [];

    try {
        if (!studentFilePath) return res.status(400).json({ success: false, message: "No file" });
        const studentCode = await fs.readFile(studentFilePath, 'utf8');
        const exerciseIds = JSON.parse(req.body.exerciseIds || "[]");

        for (const exId of exerciseIds) {
            let hybridFilePath = null;
            try {
                const exercise = db.get('exercises').find(ex => String(ex.id) === String(exId)).value();
                if (!exercise) continue;

                const absoluteMasterPath = path.join(__dirname, '..', exercise.masterPath);
                hybridFilePath = await autoTransplant(studentFilePath, absoluteMasterPath, exercise.config.functionName);

                const executor = new ObtieneRespuesta(hybridFilePath, exercise.config.timeout || 3000);
                await executor.preparaEjecutable();
                
                const inputs = Array.isArray(exercise.config.inputs) ? exercise.config.inputs : [exercise.config.inputs];
                const executionResult = await executor.respuesta(inputs);

                const rawOutput = normalize(executionResult.resultado);
                const rawError = normalize(executionResult.error);
                const { alerts, cleanResult } = auditOutput(rawOutput);
                const expectedOutput = normalize(exercise.config.expectedOutput);
                
                let errorType = null;
                let cleanLogs = rawError;

                // Aplicamos la misma lógica de detección estricta
                if (executionResult.codigo !== 0 || rawError.length > 0) {
                    errorType = "runtime_error";
                    cleanLogs = rawError.replace(/[A-Z]:\\.*\.s/gi, "programa.s");
                } else if (cleanResult !== expectedOutput) {
                    errorType = "logic_error";
                } else if (alerts.length > 0) {
                    errorType = "integrity_error";
                }

                const isCorrect = (executionResult.codigo === 0) && (cleanResult === expectedOutput) && (alerts.length === 0);
                const guiltyInstructions = alerts.length > 0 ? findGuiltyInstructions(studentCode, alerts) : [];

                results.push({
                    exerciseId: exId,
                    exerciseTitle: exercise.title,
                    passed: isCorrect,
                    errorType: errorType,
                    output: cleanResult,
                    expected: expectedOutput,
                    integrityAlerts: alerts,
                    guiltyInstructions: guiltyInstructions,
                    logs: cleanLogs
                });

            } catch (err) {
                results.push({ exerciseId: exId, passed: false, errorType: "system_error", logs: err.message });
            } finally {
                if (hybridFilePath) await fs.unlink(hybridFilePath).catch(() => {});
            }
        }
        res.json(results);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    } finally {
        if (studentFilePath) await fs.unlink(studentFilePath).catch(() => {});
    }
};