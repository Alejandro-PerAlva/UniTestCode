.data
valorSP: .word 0

.text
.globl main

main:
    # 1. Leer N (Primer argumento)
    li      $v0, 5
    syscall
    move    $a0, $v0        # $a0 = n

    # 2. Leer K (Segundo argumento)
    li      $v0, 5
    syscall
    move    $a1, $v0        # $a1 = k

    # 3. Configurar Auditoría
    sw      $sp, valorSP    # Guardar Pila original
    li      $s3, 0x55AA     # Canario en $s3 (Registro a vigilar)

    # 4. Ejecutar función del alumno
    jal     binomial

    # 5. Auditoría
    move    $t0, $v0        # Guardar resultado

    # Chequeo Registros ($s3) -> Código -1 (Naranja)
    li      $t1, 0x55AA
    bne     $s3, $t1, err_integrity

    # Chequeo Pila ($sp) -> Código -2 (Naranja)
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
binomial:
    jr      $ra
binomial_fin: