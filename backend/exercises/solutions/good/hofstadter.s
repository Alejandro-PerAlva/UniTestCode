hofstadter:
    # Prólogo
    addi    $sp, $sp, -16
    sw      $ra, 12($sp)
    sw      $s0, 8($sp)
    sw      $s1, 4($sp)
    sw      $s2, 0($sp)

    move    $s0, $a0        # Guardamos n en s0

    # Caso Base: n <= 2 -> return 1
    li      $t0, 2
    bgt     $s0, $t0, recursive_step
    li      $v0, 1
    j       end_hof

recursive_step:
    # --- TÉRMINO 1: Q(n - Q(n-1)) ---
    
    # 1. Calcular Q(n-1)
    addi    $a0, $s0, -1
    jal     hofstadter
    
    # 2. Calcular Q(n - resultado)
    sub     $a0, $s0, $v0   # $a0 = n - Q(n-1)
    jal     hofstadter
    
    move    $s1, $v0        # Guardamos el Término 1 en $s1

    # --- TÉRMINO 2: Q(n - Q(n-2)) ---
    
    # 3. Calcular Q(n-2)
    addi    $a0, $s0, -2
    jal     hofstadter
    
    # 4. Calcular Q(n - resultado)
    sub     $a0, $s0, $v0   # $a0 = n - Q(n-2)
    jal     hofstadter

    # Sumar Término 1 ($s1) + Término 2 ($v0 actual)
    add     $v0, $s1, $v0

end_hof:
    # Epílogo
    lw      $s2, 0($sp)
    lw      $s1, 4($sp)
    lw      $s0, 8($sp)
    lw      $ra, 12($sp)
    addi    $sp, $sp, 16
    jr      $ra