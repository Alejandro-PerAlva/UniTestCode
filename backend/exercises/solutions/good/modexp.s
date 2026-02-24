mod_exp:
    # Prólogo: 16 bytes
    addi    $sp, $sp, -16
    sw      $ra, 12($sp)
    sw      $s0, 8($sp)  # Base
    sw      $s1, 4($sp)  # Exp
    sw      $s2, 0($sp)  # Mod

    move    $s0, $a0
    move    $s1, $a1
    move    $s2, $a2

    # Caso Base: exp == 0 -> return 1
    beq     $s1, $zero, ret_one

    # Check Paridad: (exp % 2)
    andi    $t0, $s1, 1
    bne     $t0, $zero, es_impar

es_par:
    # exp = exp / 2
    srl     $a1, $s1, 1
    move    $a0, $s0
    move    $a2, $s2
    jal     mod_exp
    
    # temp * temp % mod
    mul     $t0, $v0, $v0
    div     $t0, $s2
    mfhi    $v0
    j       end_mod

es_impar:
    # exp = exp - 1
    addi    $a1, $s1, -1
    move    $a0, $s0
    move    $a2, $s2
    jal     mod_exp
    
    # base * temp % mod
    mul     $t0, $s0, $v0
    div     $t0, $s2
    mfhi    $v0
    j       end_mod

ret_one:
    li      $v0, 1

end_mod:
    # Epílogo
    lw      $s2, 0($sp)
    lw      $s1, 4($sp)
    lw      $s0, 8($sp)
    lw      $ra, 12($sp)
    addi    $sp, $sp, 16
    jr      $ra