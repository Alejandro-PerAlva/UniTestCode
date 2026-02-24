/**
 * trasplanta.js
 * Logic for "transplanting" a specific function from a student's file 
 * into a master evaluation template.
 */
const logger = require('./logger').logger.child({ module: 'TransplantLogic' });
const fs = require('fs').promises;

/**
 * Finds all line indexes in an array that match a specific regular expression.
 */
function getAllIndexes(lines, regExp) {
    const indexes = [];
    for (let i = 0; i < lines.length; i++) {
        if (regExp.test(lines[i])) indexes.push(i);
    }
    return indexes;
}

/**
 * Identifies the start and end line numbers of a function block based on labels.
 * @param {string[]} lines - Array of strings representing the file lines.
 * @param {Object} params - Object containing functionName and endSuffix.
 */
function verifyLabelBoundaries(lines, params) {
    const { functionName, endSuffix } = params;
    
    // Regex to match "functionName:" and "functionName_fin:" ignoring leading whitespace
    const startRegex = new RegExp(`^[ \t]*${functionName}[ \t]*:`, 'i');
    const endRegex = new RegExp(`^[ \t]*${functionName}${endSuffix}[ \t]*:`, 'i');

    const startIndexes = getAllIndexes(lines, startRegex);
    const endIndexes = getAllIndexes(lines, endRegex);

    if (startIndexes.length === 0) {
        return { error: `Label '${functionName}:' not found` };
    }

    // If no end label is found, we take until the end of the file
    let calculatedEnd = endIndexes.length > 0 ? endIndexes[0] : lines.length - 1;

    return { start: startIndexes[0], end: calculatedEnd };
}

/**
 * Reads a file and verifies its function labels.
 */
async function getFileLabelCoords(filePath, params) {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    return verifyLabelBoundaries(lines, params);
}

/**
 * Main function: Injects student code into the master teacher template.
 * @param {string} studentPath - Path to the student's .s file.
 * @param {string} masterPath - Path to the teacher's master .s file.
 * @param {string} functionName - Name of the routine to transplant.
 */
async function autoTransplant(studentPath, masterPath, functionName) {
    const endSuffix = '_fin'; 
    
    const studentCoords = await getFileLabelCoords(studentPath, { 
        functionName, 
        endSuffix 
    });
    if (studentCoords.error) throw new Error(`Student Code Error: ${studentCoords.error}`);

    const masterCoords = await getFileLabelCoords(masterPath, { 
        functionName, 
        endSuffix 
    });
    if (masterCoords.error) throw new Error(`Master File Error: ${masterCoords.error}`);

    // Read both files
    const studentLines = (await fs.readFile(studentPath, 'utf-8')).split(/\r?\n/);
    const masterLines = (await fs.readFile(masterPath, 'utf-8')).split(/\r?\n/);

    // CONSTRUCTION: [Master Top] + [Student Function Block] + [Master Bottom]
    const outputLines = [
        ...masterLines.slice(0, masterCoords.start), 
        ...studentLines.slice(studentCoords.start, studentCoords.end + 1), 
        ...masterLines.slice(masterCoords.end + 1)
    ];

    // Create the final file for evaluation
    const outputPath = studentPath.replace('.s', `_eval.s`);
    await fs.writeFile(outputPath, outputLines.join('\n'));
    
    logger.info(`Hybrid file created successfully at: ${outputPath}`);
    return outputPath;
}

module.exports = { autoTransplant, getFileLabelCoords };