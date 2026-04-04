.data
matrix: .word 1, 2, 3, 4
menu: .asciiz "\n--- MENU MATRICES ---\n1. Imprimir matriz\n2. Multiplicar por escalar\n3. Salir\nOpcion: "
msg_escalar: .asciiz "\nIntroduce el escalar: "
msg_res: .asciiz "\nMatriz actual:\n"
space: .asciiz " "
newline: .asciiz "\n"
msg_bye: .asciiz "\nSaliendo...\n"

.text
.globl main
main:
loop:
    li $v0, 4
    la $a0, menu
    syscall

    li $v0, 5
    syscall
    move $t0, $v0

    beq $t0, 1, print_matrix
    beq $t0, 2, multiply_scalar
    beq $t0, 3, exit
    j loop

print_matrix:
    li $v0, 4
    la $a0, msg_res
    syscall

    la $t1, matrix
    li $t2, 0
    li $t4, 2

row_loop:
    beq $t2, $t4, end_print
    li $t3, 0

col_loop:
    beq $t3, $t4, end_col
    lw $a0, 0($t1)
    li $v0, 1
    syscall
    li $v0, 4
    la $a0, space
    syscall

    addi $t1, $t1, 4
    addi $t3, $t3, 1
    j col_loop

end_col:
    li $v0, 4
    la $a0, newline
    syscall
    addi $t2, $t2, 1
    j row_loop

end_print:
    j loop

multiply_scalar:
    li $v0, 4
    la $a0, msg_escalar
    syscall
    li $v0, 5
    syscall
    move $t5, $v0

    la $t1, matrix
    li $t2, 0
    li $t4, 4

mul_loop:
    beq $t2, $t4, end_mul
    lw $t6, 0($t1)
    mul $t6, $t6, $t5
    sw $t6, 0($t1)
    addi $t1, $t1, 4
    addi $t2, $t2, 1
    j mul_loop

end_mul:
    j loop

exit:
    li $v0, 4
    la $a0, msg_bye
    syscall
    li $v0, 10
    syscall