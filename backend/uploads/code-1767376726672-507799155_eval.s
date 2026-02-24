.data
valorSP: .word 0

.text
.globl main

main:
    # 1. Leer N
    li      $v0, 5
    syscall
    move    $a0, $v0        # $a0 = n

    # 2. Configurar Auditoría
    sw      $sp, valorSP    # Guardar Pila original
    li      $s5, 0xFACE     # Canario en $s5 (Registro a vigilar)

    # 3. Ejecutar función alumno
    jal     hofstadter

    # 4. Auditoría
    move    $t0, $v0        # Guardar resultado del alumno

    # Chequeo de Registros ($s5) -> Código -1
    li      $t1, 0xFACE
    bne     $s5, $t1, err_integrity

    # Chequeo de Pila ($sp) -> Código -2
    lw      $t2, valorSP
    bne     $sp, $t2, err_stack

    # ÉXITO: Devolver resultado real
    move    $a0, $t0
    li      $v0, 1
    syscall
    j       fin

err_integrity:
    li      $a0, -1
    li      $v0, 1
    syscall
    j       fin

err_stack:
    li      $a0, -2
    li      $v0, 1
    syscall
    j       fin

fin:
    li      $v0, 10
    syscall

# --- ZONA DE TRASPLANTE ---
hofstadter:
    li   $s5, 0x666    # <--- Corrupción de registro
    li   $v0, 4        # Resultado correcto numéricamente
    jr   $ra

# 4. BINOMIAL -> ❌ ERROR LÓGICO (Rojo)
binomial:
    li   $v0, 999      # Resultado inventado (Fallo lógico)
    jr   $ra