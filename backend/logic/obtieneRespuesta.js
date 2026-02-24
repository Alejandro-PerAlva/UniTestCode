/**
 * obtienerespuesta.js
 * Engine class to execute MIPS source code using the MARS simulator.
 * Handles process spawning, input injection, and timeout management.
 */
const { spawn } = require('node:child_process');
const logger = require('./logger').logger.child({ module: 'MipsExecutor' });
const fs = require('fs');
const path = require('path');

class ObtieneRespuesta {
    /**
     * @param {string} sourcePath - Path to the .s file to execute.
     * @param {number} timeout - Maximum execution time in milliseconds.
     */
    constructor(sourcePath, timeout = 3000) {
        this.sourcePath = sourcePath;
        this.cpuTimeLimitMs = timeout;

        // Path to the MARS simulator JAR file
        const marsJarPath = path.join(__dirname, '../bin/Mars45.jar');
        
        // Command and arguments for headless MARS execution
        // 'nc' stands for No Console (pure CLI mode)
        this.executable = 'java';
        this.args = ['-jar', marsJarPath, 'nc', this.sourcePath];
    }

    /**
     * Verifies if the source file exists before attempting execution.
     */
    async preparaEjecutable() {
        if (!fs.existsSync(this.sourcePath)) {
            logger.error(`Source file not found: ${this.sourcePath}`);
            throw new Error(`File does not exist: ${this.sourcePath}`);
        }
    }

    /**
     * Executes the simulator and pipes inputs to stdin.
     * @param {Array} inputs - List of inputs to be injected into the MIPS program via syscalls.
     * @returns {Promise} - Resolves with stdout, stderr, exit code, and timeout status.
     */
    respuesta(inputs = []) {
        return new Promise((resolve, reject) => {
            let child;
            try {
                child = spawn(this.executable, this.args);
            } catch (err) {
                logger.error(`Failed to launch Java process: ${err.message}`);
                return reject(`Java launch error: ${err.message}`);
            }

            let stdoutData = [];
            let stderrData = [];
            let killedByTimeout = false;

            // Execution timeout protection
            const timer = setTimeout(() => {
                killedByTimeout = true;
                child.kill('SIGKILL');
                logger.warn(`Execution timed out for: ${this.sourcePath}`);
            }, this.cpuTimeLimitMs);

            // Inject test inputs via standard input (stdin)
            if (inputs.length > 0) {
                const formattedInput = inputs.join('\n') + '\n';
                child.stdin.write(formattedInput);
                child.stdin.end();
            }

            // Capture program output
            child.stdout.on('data', (data) => stdoutData.push(data.toString()));
            
            // Capture simulator errors
            child.stderr.on('data', (data) => stderrData.push(data.toString()));

            child.on('close', (code) => {
                clearTimeout(timer);
                resolve({
                    resultado: stdoutData.join(''),
                    error: stderrData.join(''),
                    codigo: code,
                    timeout: killedByTimeout
                });
            });
            
            child.on('error', (err) => {
                clearTimeout(timer);
                logger.error(`Process error: ${err.message}`);
                reject(err);
            });
        });
    }
}

module.exports = { ObtieneRespuesta };