binomial:
    # Prólogo INCOMPLETO (No guardamos s3)
    addi    $sp, $sp, -12
    sw      $ra, 8($sp)
    sw      $s0, 4($sp)
    sw      $s1, 0($sp)

    move    $s0, $a0
    move    $s1, $a1

    beq     $s1, $zero, ret_1
    beq     $s1, $s0, ret_1
    bgt     $s1, $s0, ret_0

    # Recursión 1
    addi    $a0, $s0, -1
    addi    $a1, $s1, -1
    jal     binomial
    
    # --- ERROR DE INTEGRIDAD ---
    # Usamos $s3 para guardar el resultado parcial.
    # Esto "ensucia" el registro que el Master Code está vigilando (0x55AA).
    move    $s3, $v0        

    # Recursión 2
    addi    $a0, $s0, -1
    move    $a1, $s1
    jal     binomial

    add     $v0, $s3, $v0   # Usamos el valor de s3
    rem     $v0, $v0, 127
    j       exit_bin

ret_1:
    li      $v0, 1
    j       exit_bin
ret_0:
    li      $v0, 0

exit_bin:
    lw      $s1, 0($sp)
    lw      $s0, 4($sp)
    lw      $ra, 8($sp)
    addi    $sp, $sp, 12
    jr      $ra