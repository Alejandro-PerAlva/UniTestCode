hofstadter:
    addi    $sp, $sp, -12
    sw      $ra, 8($sp)
    sw      $s0, 4($sp)
    sw      $s1, 0($sp)

    move    $s0, $a0
    li      $t0, 2
    bgt     $s0, $t0, fib_logic # Si n > 2, recursión

    li      $v0, 1
    j       end_logic

fib_logic:
    # ERROR LÓGICO: Implementa Fibonacci simple
    # Q(n-1)
    addi    $a0, $s0, -1
    jal     hofstadter
    move    $s1, $v0

    # Q(n-2)
    addi    $a0, $s0, -2
    jal     hofstadter
    
    add     $v0, $s1, $v0   # Fibonacci: F(n-1) + F(n-2)

end_logic:
    lw      $s1, 0($sp)
    lw      $s0, 4($sp)
    lw      $ra, 8($sp)
    addi    $sp, $sp, 12
    jr      $ra