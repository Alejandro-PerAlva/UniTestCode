tribit:
    addi    $sp, $sp, -16
    sw      $ra, 12($sp)
    sw      $s0, 8($sp)
    sw      $s1, 4($sp)
    sw      $s2, 0($sp)

    move    $s2, $a0
    li      $t0, 3
    blt     $s2, $t0, base_logic

    addi    $a0, $s2, -1
    jal     tribit
    move    $s0, $v0

    addi    $a0, $s2, -2
    jal     tribit
    move    $s1, $v0

    addi    $a0, $s2, -3
    jal     tribit

    # ERROR LÓGICO: SUMA TOTAL EN VEZ DE XOR
    add     $t1, $s0, $s1   
    add     $v0, $t1, $v0
    j       fin_logic

base_logic:
    move    $v0, $s2

fin_logic:
    lw      $s2, 0($sp)
    lw      $s1, 4($sp)
    lw      $s0, 8($sp)
    lw      $ra, 12($sp)
    addi    $sp, $sp, 16
    jr      $ra