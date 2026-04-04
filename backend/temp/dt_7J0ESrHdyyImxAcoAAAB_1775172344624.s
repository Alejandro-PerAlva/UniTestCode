.data
msg_menu: .asciiz "\n1. Suma\n2. Resta\n3. Multiplicacion\nOpcion: "

.text
.globl main
main:
    li $t0, 15
    li $t1, 5

loop:
    li $v0, 4
    la $a0, msg_menu
    syscall

    li $v0, 5
    syscall
    move $t3, $v0

    beq $t3, 1, op_add
    beq $t3, 2, op_sub
    beq $t3, 3, op_mul
    j loop

op_add:
    add $t2, $t0, $t1
    j end_program

op_sub:
    sub $t2, $t0, $t1
    j end_program

op_mul:
    mul $t2, $t0, $t1
    j end_program





.data
marker: .asciiz "\n___REG_DUMP [$t2]___\nValor exacto: "

.text
end_program:
    li $v0, 4
    la $a0, marker
    syscall

    li $v0, 1
    move $a0, $t2
    syscall

    li $v0, 10
    syscall