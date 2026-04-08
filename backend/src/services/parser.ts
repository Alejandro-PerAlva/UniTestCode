const PRINT_MATRIZ_HEX_REGEX = /print_matriz:[\s\S]*?print_matriz__MARCAFIN:/;
const PRINT_MATRIZ_MIPS = `print_matriz:
    addi $sp, $sp, -24
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    sw $s1, 8($sp)
    sw $s2, 12($sp)
    sw $s3, 16($sp)
    sw $s4, 20($sp)
    move $s0, $a0
    lw $s1, 0($s0)
    lw $s2, 4($s0)
    li $v0, 4
    la $a0, str_matTiene
    syscall
    li $v0, 1
    move $a0, $s1
    syscall
    li $v0, 11
    li $a0, 120
    syscall
    li $v0, 1
    move $a0, $s2
    syscall
    li $v0, 11
    li $a0, 10
    syscall
    move $s3, $zero
pm_forF:
    bge $s3, $s1, pm_forF_fin
    move $s4, $zero
pm_forC:
    bge $s4, $s2, pm_forC_fin
    mul $t0, $s3, $s2
    add $t0, $t0, $s4
    mul $t0, $t0, 8
    add $t0, $t0, $s0
    l.d $f12, 8($t0)
    li $v0, 3
    syscall
    li $v0, 11
    li $a0, 32
    syscall
    addi $s4, $s4, 1
    b pm_forC
pm_forC_fin:
    li $v0, 11
    li $a0, 10
    syscall
    addi $s3, $s3, 1
    b pm_forF
pm_forF_fin:
    lw $ra, 0($sp)
    lw $s0, 4($sp)
    lw $s1, 8($sp)
    lw $s2, 12($sp)
    lw $s3, 16($sp)
    lw $s4, 20($sp)
    addi $sp, $sp, 24
    jr $ra
print_matriz__MARCAFIN:`;

const cleanBasicSyntax = (code: string): string => {
    let clean = code.replace(/\xA0/g, ' ');
    clean = clean.replace(/\$s8\b/g, '$fp');
    clean = clean.replace(/;\s*(?=#|\r?\n|$)/g, '');
    clean = clean.replace(/\.word\s+0x([0-9a-fA-F]{8})([0-9a-fA-F]{8})\b/gi, '.word 0x$1, 0x$2');
    return clean;
};

const resolveConstants = (code: string): string => {
    const constants: { name: string, value: string }[] = [];
    let clean = code.replace(/^[ \t]*([a-zA-Z_]\w*)[ \t]*=[ \t]*(-?\d+)[^\n\r]*/gm, (_, name, value) => {
        constants.push({ name, value });
        return ''; 
    });

    constants.forEach(c => {
        const regex = new RegExp(`\\b${c.name}\\b`, 'g');
        clean = clean.replace(regex, c.value);
    });
    return clean;
};

const fixAddiShortcuts = (code: string): string => {
    return code.replace(/\b(addi)\s+(\$[a-z0-9]{1,2})\s*,\s*(-?\d+)\b/gi, '$1 $2, $2, $3');
};

const extractInlineFloats = (code: string): string => {
    let dataSection = '\n\n.data\n';
    let dataAdded = false;
    let floatCounter = 0;
    let doubleCounter = 0;
    const uid = Math.random().toString(36).substring(2, 8);

    let clean = code.replace(/li\.d[ \t]+(\$f\d+)[ \t]*,[ \t]*([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)/ig, (_, reg, val) => {
        const label = `_auto_double_${uid}_${doubleCounter++}`;
        dataSection += `${label}: .double ${val}\n`;
        dataAdded = true;
        return `l.d ${reg}, ${label}`;
    });

    clean = clean.replace(/li\.s[ \t]+(\$f\d+)[ \t]*,[ \t]*([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)/ig, (_, reg, val) => {
        const label = `_auto_float_${uid}_${floatCounter++}`;
        dataSection += `${label}: .float ${val}\n`;
        dataAdded = true;
        return `l.s ${reg}, ${label}`;
    });

    return dataAdded ? clean + dataSection : clean;
};

const fixDoubleMemoryAccess = (code: string): string => {
    return code.replace(/\b(l\.d|s\.d)\s+\$f(\d+)\s*,\s*(-?\d+)?\s*\(\s*(\$[a-z0-9]+)\s*\)/gi, (_, instr, reg, offset, base) => {
        const regNum = parseInt(reg);
        const offNum = offset ? parseInt(offset) : 0;
        const op = instr.toLowerCase() === 'l.d' ? 'lwc1' : 'swc1';
        return `${op} $f${regNum}, ${offNum}(${base})\n\t${op} $f${regNum + 1}, ${offNum + 4}(${base})`;
    });
};

const ensureEntryPoint = (code: string): string => {
    if (code.match(/\bmain[ \t]*:/)) {
        return "\n.text\nj main\n" + code;
    }
    return code;
};

export const normalizeSpimToMars = (code: string): string => {
    if (!code) return "";

    let result = cleanBasicSyntax(code);
    result = result.replace(PRINT_MATRIZ_HEX_REGEX, PRINT_MATRIZ_MIPS);
    result = resolveConstants(result);
    result = fixAddiShortcuts(result);
    result = extractInlineFloats(result);
    result = fixDoubleMemoryAccess(result);
    result = ensureEntryPoint(result);

    return result;
};