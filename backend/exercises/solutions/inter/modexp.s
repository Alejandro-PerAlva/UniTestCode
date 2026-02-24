mod_exp:
    # --- PRÓLOGO ---
    addi    $sp, $sp, -16   # Reservamos 16
    sw      $ra, 12($sp)
    sw      $s0, 8($sp)
    sw      $s1, 4($sp)
    sw      $s2, 0($sp)

    # (Lógica Correcta Resumida)
    move    $s0, $a0
    move    $s1, $a1
    move    $s2, $a2

    beq     $s1, $zero, ret_bad_1

    andi    $t0, $s1, 1
    bne     $t0, $zero, odd_bad

    srl     $a1, $s1, 1
    jal     mod_exp
    mul     $t0, $v0, $v0
    div     $t0, $s2
    mfhi    $v0
    j       fin_bad

odd_bad:
    addi    $a1, $s1, -1
    jal     mod_exp
    mul     $t0, $s0, $v0
    div     $t0, $s2
    mfhi    $v0
    j       fin_bad

ret_bad_1:
    li      $v0, 1

fin_bad:
    # --- EPÍLOGO CORRUPTO ---
    lw      $s2, 0($sp)
    lw      $s1, 4($sp)
    lw      $s0, 8($sp)
    lw      $ra, 12($sp)
    
    # ERROR FATAL: Reservamos 16, liberamos 4
    addi    $sp, $sp, 4    
    
    jr      $ra