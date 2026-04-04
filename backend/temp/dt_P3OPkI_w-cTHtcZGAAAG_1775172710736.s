.data
msg_in:  .asciiz "Introduce un valor: "
msg_out: .asciiz "\nResultado final en $v0: "

.text
.globl main
main:
    # 1. El maestro pide los inputs (protegido, el alumno no toca esto)
    li $v0, 4
    la $a0, msg_in
    syscall

    li $v0, 5
    syscall
    move $a0, $v0 # Pasamos el input como argumento a la rutina

    # 2. Llamada a la etiqueta de trasplante
    jal rutina_principal
    
    # 3. Impresion infalible de resultados (Evaluacion)
    move $t0, $v0 # Guardamos el resultado de la funcion
    li $v0, 4
    la $a0, msg_out
    syscall

    li $v0, 1
    move $a0, $t0
    syscall

    li $v0, 10
    syscall

# --- AQUI EMPIEZA LA ZONA DE TRASPLANTE ---
rutina_principal:
    # El profesor puede dejar aqui una solucion de ejemplo
    add $v0, $a0, $a0 
    jr $ra
rutina_principal_fin:
# --- FIN DE LA ZONA ---