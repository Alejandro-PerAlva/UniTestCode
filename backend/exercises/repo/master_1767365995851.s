.data
valorSP: .word 0

.text
.globl main

main:
    # 1. Leer BASE ($a0)
    li      $v0, 5
    syscall
    move    $a0, $v0

    # 2. Leer EXPONENTE ($a1)
    li      $v0, 5
    syscall
    move    $a1, $v0

    # 3. Leer MÓDULO ($a2)
    li      $v0, 5
    syscall
    move    $a2, $v0

    # 4. Configurar Auditoría
    sw      $sp, valorSP    # Snapshot de la pila
    li      $s7, 0xDEAD     # Canario en $s7

    # 5. Ejecutar
    jal     mod_exp

    # 6. Auditoría
    move    $t0, $v0        # Guardar resultado

    # Check Integridad ($s7) -> -1
    li      $t1, 0xDEAD
    bne     $s7, $t1, err_integrity

    # Check Pila ($sp) -> -2
    lw      $t2, valorSP
    bne     $sp, $t2, err_stack

    # ÉXITO
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
mod_exp:
    jr      $ra
mod_exp_fin: