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
    li   $s7, 0x0      # <--- Corrupción de registro
    li   $v0, 4        # Resultado correcto
    jr   $ra

# 2. COLLATZ -> ⚠️ INTEGRIDAD (Naranja)
# Rompe la pila (Stack Leak)
collatz_bit:
    addi $sp, $sp, -8  # Reserva 8
    li   $v0, 16       # Resultado correcto
    addi $sp, $sp, 4   # <--- ERROR: Solo libera 4 (Pila desbalanceada)
    jr   $ra

# 3. HOFSTADTER -> ❌ ERROR LÓGICO (Rojo)
hofstadter:
    li   $v0, 0        # Resultado incorrecto
    jr   $ra

# 4. BINOMIAL -> ❌ ERROR LÓGICO (Rojo)
binomial:
    li   $v0, -5       # Resultado incorrecto
    jr   $ra

# 5. MOD_EXP -> (Opcional) Si quieres añadir el 5º
mod_exp:
    li   $v0, 0
    jr   $ra