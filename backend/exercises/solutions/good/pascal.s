binomial:
    # Prólogo: Guardamos RA y los registros que usaremos
    addi    $sp, $sp, -16
    sw      $ra, 12($sp)
    sw      $s0, 8($sp)
    sw      $s1, 4($sp)
    sw      $s2, 0($sp)

    move    $s0, $a0        # s0 = n
    move    $s1, $a1        # s1 = k

    # Casos Base
    # if k == 0 return 1
    beq     $s1, $zero, return_one
    # if k == n return 1
    beq     $s1, $s0, return_one
    # if k > n return 0
    bgt     $s1, $s0, return_zero

    # --- Recursión 1: C(n-1, k-1) ---
    addi    $a0, $s0, -1    # n-1
    addi    $a1, $s1, -1    # k-1
    jal     binomial
    move    $s2, $v0        # Guardamos resultado 1 en s2

    # --- Recursión 2: C(n-1, k) ---
    addi    $a0, $s0, -1    # n-1
    move    $a1, $s1        # k (recuperado de s1)
    jal     binomial
    
    # Suma y Módulo
    add     $v0, $s2, $v0   # Res1 + Res2
    rem     $v0, $v0, 127   # Módulo 127
    j       end_bin

return_one:
    li      $v0, 1
    j       end_bin

return_zero:
    li      $v0, 0

end_bin:
    # Epílogo
    lw      $s2, 0($sp)
    lw      $s1, 4($sp)
    lw      $s0, 8($sp)
    lw      $ra, 12($sp)
    addi    $sp, $sp, 16
    jr      $ra