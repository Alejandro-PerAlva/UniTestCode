.data
msg_in:  .asciiz "Introduce un valor: "
msg_out: .asciiz "Resultado: "

.text
.globl main
main:
    li $v0, 4
    la $a0, msg_in
    syscall

    li $v0, 5
    syscall
    move $a0, $v0

    jal rutina_principal
    
    move $t0, $v0
    li $v0, 4
    la $a0, msg_out
    syscall

    li $v0, 1
    move $a0, $t0
    syscall

    li $v0, 10
    syscall

rutina_principal:
    add $v0, $a0, $a0 
    jr $ra
rutina_principal_fin: