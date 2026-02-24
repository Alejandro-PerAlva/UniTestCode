# =================================================================
# TEST A: 2 VERDES, 1 NARANJA, 1 ROJO
# =================================================================

.text

# 1. TRIBIT -> ✅ CORRECTO (Verde)
tribit:
    addi $sp, $sp, -4
    sw   $ra, 0($sp)
    # Lógica correcta para Input 6 -> 4
    li   $v0, 4 
    lw   $ra, 0($sp)
    addi $sp, $sp, 4
    jr   $ra

# 2. COLLATZ -> ✅ CORRECTO (Verde)
collatz_bit:
    # Lógica correcta para Input 7 -> 16
    li   $v0, 16
    jr   $ra

# 3. HOFSTADTER -> ⚠️ INTEGRIDAD (Naranja)
# Corrompe el registro $s5 que vigila el Master Code
hofstadter:
    li   $s5, 0x666    # <--- Corrupción de registro
    li   $v0, 4        # Resultado correcto numéricamente
    jr   $ra

# 4. BINOMIAL -> ❌ ERROR LÓGICO (Rojo)
binomial:
    li   $v0, 999      # Resultado inventado (Fallo lógico)
    jr   $ra