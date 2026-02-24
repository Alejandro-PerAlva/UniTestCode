.data
valorSP: .word 0

.text
.globl main

main:
    # 1. Leer N (Input inyectado)
    li      $v0, 5
    syscall
    move    $a0, $v0        # $a0 = n

    # 2. Configurar Auditoría
    # Guardamos el puntero de pila original para ver si cambia
    sw      $sp, valorSP    
    # "Canario" en $s7 para ver si lo rompen
    li      $s7, 0xCAFE     

    # 3. Llamar a la función del alumno
    jal     tribit

    # 4. Auditoría Post-Ejecución
    move    $t0, $v0        # Guardar resultado del alumno

    # --- CHEQUEO 1: INTEGRIDAD DE PILA ($sp) ---
    # Si $sp no es igual a como empezó, es un error grave (Naranja)
    lw      $t2, valorSP
    bne     $sp, $t2, error_pila

    # --- CHEQUEO 2: INTEGRIDAD DE REGISTROS ($s7) ---
    li      $t1, 0xCAFE
    bne     $s7, $t1, error_registros

    # --- ÉXITO ---
    # Si pasa las auditorías, imprimimos el resultado calculado
    move    $a0, $t0
    li      $v0, 1
    syscall
    j       fin

error_pila:
    # CÓDIGO -2: Pila Desbalanceada (Activa alerta naranja de Pila)
    li      $a0, -2
    li      $v0, 1
    syscall
    j       fin

error_registros:
    # CÓDIGO -1: Registro Preservado Corrupto (Activa alerta naranja de Registros)
    li      $a0, -1
    li      $v0, 1
    syscall
    j       fin

fin:
    li      $v0, 10
    syscall

# --- ZONA DE TRASPLANTE ---
tribit:
    addi    $sp, $sp, -16
    sw      $ra, 12($sp)
    sw      $s0, 8($sp)
    sw      $s1, 4($sp)
    sw      $s2, 0($sp)
    move    $s2, $a0
    li      $t0, 3
    blt     $s2, $t0, tri_ok_base
    addi    $a0, $s2, -1
    jal     tribit
    move    $s0, $v0
    addi    $a0, $s2, -2
    jal     tribit
    move    $s1, $v0
    addi    $a0, $s2, -3
    jal     tribit
    xor     $t1, $s0, $s1
    add     $v0, $t1, $v0
    j       tri_ok_end
tri_ok_base:
    move    $v0, $s2
tri_ok_end:
    lw      $s2, 0($sp)
    lw      $s1, 4($sp)
    lw      $s0, 8($sp)
    lw      $ra, 12($sp)
    addi    $sp, $sp, 16
    jr      $ra

# -----------------------------------------------------------------
# 2. HOFSTADTER Q -> ✅ PASSED
# -----------------------------------------------------------------
hofstadter:
    addi    $sp, $sp, -16
    sw      $ra, 12($sp)
    sw      $s0, 8($sp)
    sw      $s1, 4($sp)
    sw      $s2, 0($sp)
    move    $s0, $a0
    li      $t0, 2
    bgt     $s0, $t0, hof_ok_rec
    li      $v0, 1
    j       hof_ok_end
hof_ok_rec:
    addi    $a0, $s0, -1
    jal     hofstadter
    sub     $a0, $s0, $v0
    jal     hofstadter
    move    $s1, $v0
    addi    $a0, $s0, -2
    jal     hofstadter
    sub     $a0, $s0, $v0
    jal     hofstadter
    add     $v0, $s1, $v0
hof_ok_end:
    lw      $s2, 0($sp)
    lw      $s1, 4($sp)
    lw      $s0, 8($sp)
    lw      $ra, 12($sp)
    addi    $sp, $sp, 16
    jr      $ra

# -----------------------------------------------------------------
# 3. BINOMIAL -> ✅ PASSED
# -----------------------------------------------------------------
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