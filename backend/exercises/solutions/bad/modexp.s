mod_exp:
    # Lógica simplona incorrecta: return base^exp
    # No aplica módulo en pasos intermedios -> Error lógico
    li      $v0, 1
    move    $t0, $a0 # base
    move    $t1, $a1 # exp

loop_pow:
    beq     $t1, $zero, end_pow
    mul     $v0, $v0, $t0   # Multiplica sin módulo
    addi    $t1, $t1, -1
    j       loop_pow

end_pow:
    # El alumno intenta aplicar módulo solo al final (o se le olvida)
    # div $v0, $a2
    # mfhi $v0
    jr      $ra