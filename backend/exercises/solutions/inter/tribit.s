tribit:
    # --- PRÓLOGO ---
    addi    $sp, $sp, -16
    sw      $ra, 12($sp)
    sw      $s0, 8($sp)
    sw      $s1, 4($sp)
    sw      $s2, 0($sp)
    # ERROR DE INTEGRIDAD: No estamos guardando $s7 en la pila,
    # pero lo vamos a usar abajo. Esto corrompe el contexto del caller.

    move    $s2, $a0        # n en s2

    # --- LÓGICA ---
    li      $t0, 3
    blt     $s2, $t0, caso_base

    # Recursión 1
    addi    $a0, $s2, -1
    jal     tribit
    move    $s0, $v0

    # Recursión 2
    addi    $a0, $s2, -2
    jal     tribit
    move    $s1, $v0

    # Recursión 3
    addi    $a0, $s2, -3
    jal     tribit
    
    # Operación
    xor     $t1, $s0, $s1
    add     $v0, $t1, $v0

    # --- EL CRIMEN ---
    # Escribimos basura en $s7. Como no hicimos 'sw $s7' arriba,
    # este cambio es permanente y el Master Code se dará cuenta.
    li      $s7, 12345      

    j       fin_tribit

caso_base:
    move    $v0, $s2

fin_tribit:
    lw      $s2, 0($sp)
    lw      $s1, 4($sp)
    lw      $s0, 8($sp)
    lw      $ra, 12($sp)
    addi    $sp, $sp, 16
    jr      $ra