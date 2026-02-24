tribit:
    # Guardar contexto ($ra y registros S)
    addi    $sp, $sp, -16
    sw      $ra, 12($sp)
    sw      $s0, 8($sp)
    sw      $s1, 4($sp)
    sw      $s2, 0($sp)

    move    $s2, $a0        # n en $s2

    # Caso base: n < 3 -> return n
    li      $t0, 3
    blt     $s2, $t0, base

    # T(n-1)
    addi    $a0, $s2, -1
    jal     tribit
    move    $s0, $v0        # Guardar en $s0

    # T(n-2)
    addi    $a0, $s2, -2
    jal     tribit
    move    $s1, $v0        # Guardar en $s1

    # T(n-3)
    addi    $a0, $s2, -3
    jal     tribit
    # Resultado en $v0

    # Operación: (T(n-1) XOR T(n-2)) + T(n-3)
    xor     $t1, $s0, $s1
    add     $v0, $t1, $v0
    j       exit

base:
    move    $v0, $s2

exit:
    # Restaurar todo
    lw      $s2, 0($sp)
    lw      $s1, 4($sp)
    lw      $s0, 8($sp)
    lw      $ra, 12($sp)
    addi    $sp, $sp, 16
    jr      $ra