# =================================================================
# TEST B: 2 NARANJAS, 2 ROJOS
# =================================================================

.text

# 1. TRIBIT -> ⚠️ INTEGRIDAD (Naranja)
# Rompe el registro $s7 (Canario)
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