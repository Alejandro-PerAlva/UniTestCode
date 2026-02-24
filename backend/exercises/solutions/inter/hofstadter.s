hofstadter:
    # Prólogo (Falta guardar s5)
    addi    $sp, $sp, -16
    sw      $ra, 12($sp)
    sw      $s0, 8($sp)
    sw      $s1, 4($sp)
    sw      $s2, 0($sp)

    move    $s0, $a0        

    # Caso Base
    li      $t0, 2
    bgt     $s0, $t0, recursive_step
    li      $v0, 1
    j       end_hof

recursive_step:
    # Usamos $s5 ILEGALMENTE para guardar n temporalmente
    move    $s5, $s0        # <--- AQUÍ MANCHAMOS $s5 (Canario)

    # Cálculo Parte 1
    addi    $a0, $s5, -1
    jal     hofstadter
    sub     $a0, $s5, $v0
    jal     hofstadter
    move    $s1, $v0

    # Cálculo Parte 2
    addi    $a0, $s5, -2
    jal     hofstadter
    sub     $a0, $s5, $v0
    jal     hofstadter

    add     $v0, $s1, $v0

end_hof:
    lw      $s2, 0($sp)
    lw      $s1, 4($sp)
    lw      $s0, 8($sp)
    lw      $ra, 12($sp)
    addi    $sp, $sp, 16
    jr      $ra