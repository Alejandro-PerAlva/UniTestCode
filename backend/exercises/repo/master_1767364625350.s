.data
valorSP: .word 0

.text
.globl main

main:
    # 1. Leer N (Input inyectado)
    li      $v0, 5
    syscall
    move    $a0, $v0        # $a0 = n

    # 2. Configurar Auditoría
    # Guardamos el puntero de pila original para ver si cambia
    sw      $sp, valorSP    
    # "Canario" en $s7 para ver si lo rompen
    li      $s7, 0xCAFE     

    # 3. Llamar a la función del alumno
    jal     tribit

    # 4. Auditoría Post-Ejecución
    move    $t0, $v0        # Guardar resultado del alumno

    # --- CHEQUEO 1: INTEGRIDAD DE PILA ($sp) ---
    # Si $sp no es igual a como empezó, es un error grave (Naranja)
    lw      $t2, valorSP
    bne     $sp, $t2, error_pila

    # --- CHEQUEO 2: INTEGRIDAD DE REGISTROS ($s7) ---
    li      $t1, 0xCAFE
    bne     $s7, $t1, error_registros

    # --- ÉXITO ---
    # Si pasa las auditorías, imprimimos el resultado calculado
    move    $a0, $t0
    li      $v0, 1
    syscall
    j       fin

error_pila:
    # CÓDIGO -2: Pila Desbalanceada (Activa alerta naranja de Pila)
    li      $a0, -2
    li      $v0, 1
    syscall
    j       fin

error_registros:
    # CÓDIGO -1: Registro Preservado Corrupto (Activa alerta naranja de Registros)
    li      $a0, -1
    li      $v0, 1
    syscall
    j       fin

fin:
    li      $v0, 10
    syscall

# --- ZONA DE TRASPLANTE ---
tribit:
    jr      $ra
tribit_fin: