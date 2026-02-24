.data
valorSP: .word 0

.text
.globl main

main:
    # 1. Leer N (Primer argumento)
    li      $v0, 5
    syscall
    move    $a0, $v0        # $a0 = n

    # 2. Leer K (Segundo argumento)
    li      $v0, 5
    syscall
    move    $a1, $v0        # $a1 = k

    # 3. Configurar Auditoría
    sw      $sp, valorSP    # Guardar Pila original
    li      $s3, 0x55AA     # Canario en $s3 (Registro a vigilar)

    # 4. Ejecutar función del alumno
    jal     binomial

    # 5. Auditoría
    move    $t0, $v0        # Guardar resultado

    # Chequeo Registros ($s3) -> Código -1 (Naranja)
    li      $t1, 0x55AA
    bne     $s3, $t1, err_integrity

    # Chequeo Pila ($sp) -> Código -2 (Naranja)
    lw      $t2, valorSP
    bne     $sp, $t2, err_stack

    # ÉXITO: Devolver resultado real
    move    $a0, $t0
    li      $v0, 1
    syscall
    j       fin

err_integrity:
    li      $a0, -1
    li      $v0, 1
    syscall
    j       fin

err_stack:
    li      $a0, -2
    li      $v0, 1
    syscall
    j       fin

fin:
    li      $v0, 10
    syscall

# --- ZONA DE TRASPLANTE ---
binomial:
    addi    $sp, $sp, -16
    sw      $ra, 12($sp)
    sw      $s0, 8($sp)
    sw      $s1, 4($sp)
    sw      $s2, 0($sp)
    move    $s0, $a0
    move    $s1, $a1
    beq     $s1, $zero, bin_ok_one
    beq     $s1, $s0, bin_ok_one
    bgt     $s1, $s0, bin_ok_zero
    addi    $a0, $s0, -1
    addi    $a1, $s1, -1
    jal     binomial
    move    $s2, $v0
    addi    $a0, $s0, -1
    move    $a1, $s1
    jal     binomial
    add     $v0, $s2, $v0
    rem     $v0, $v0, 127
    j       bin_ok_end
bin_ok_one:
    li      $v0, 1
    j       bin_ok_end
bin_ok_zero:
    li      $v0, 0
bin_ok_end:
    lw      $s2, 0($sp)
    lw      $s1, 4($sp)
    lw      $s0, 8($sp)
    lw      $ra, 12($sp)
    addi    $sp, $sp, 16
    jr      $ra

# -----------------------------------------------------------------
# 4. MOD_EXP -> ✅ PASSED
# -----------------------------------------------------------------
mod_exp:
    addi    $sp, $sp, -16
    sw      $ra, 12($sp)
    sw      $s0, 8($sp)
    sw      $s1, 4($sp)
    sw      $s2, 0($sp)
    move    $s0, $a0
    move    $s1, $a1
    move    $s2, $a2
    beq     $s1, $zero, mod_ok_one
    andi    $t0, $s1, 1
    bne     $t0, $zero, mod_ok_odd
    srl     $a1, $s1, 1
    jal     mod_exp
    mul     $t0, $v0, $v0
    div     $t0, $s2
    mfhi    $v0
    j       mod_ok_end
mod_ok_odd:
    addi    $a1, $s1, -1
    jal     mod_exp
    mul     $t0, $s0, $v0
    div     $t0, $s2
    mfhi    $v0
    j       mod_ok_end
mod_ok_one:
    li      $v0, 1
mod_ok_end:
    lw      $s2, 0($sp)
    lw      $s1, 4($sp)
    lw      $s0, 8($sp)
    lw      $ra, 12($sp)
    addi    $sp, $sp, 16
    jr      $ra