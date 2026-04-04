.data
titulo: .ascii "\nPR1. Principios de Computadores.\n"
        .ascii "\nUn numero primo es un natural mayor que 1 que es divisble\n" 
        .ascii "unicamente entre 1 y el mismo. Este programa descubre los\n"
        .ascii "numero primos en un rango de numero naturales [a,b] siendo\n"
        .ascii "a y b naturales mayores que 1. El programa debera comprobar\n"
        .ascii "que se cumple ademas que b es mayor o igual que a y que son\n"
        .asciiz "menores que 1001 para que ejecute en tiempo razonable.\n\n"
msg1:   .asciiz "Introduce el limite inferior [a]: "
msg2:   .asciiz "Introduce el limite superior [b]: "
msgerr: .asciiz "Error, vuelve a introducir el rango.\n"
msgfin: .asciiz "\nFin del programa.\n"

    .text
main:
    # TABLA DE REGISTROS
    # $s0 = inferior, $s1 = superior, $s2 = i, $s3 = j, $s4 = esPrimo

    li $v0,4
    la $a0,titulo
    syscall

do:
    # Pedir limite inferior [a]
    li $v0,4
    la $a0,msg1
    syscall
    li $v0,5
    syscall
    move $s0,$v0

    # Validar inferior
    blt $s0,2,a_mal
    bgt $s0,1000,a_mal
    j a_ok

a_mal:
    li $v0,4
    la $a0,msgerr
    syscall
    j do

a_ok:
    # Pedir limite superior [b]
    li $v0,4
    la $a0,msg2
    syscall
    li $v0,5
    syscall
    move $s1,$v0

    # Validar superior: (b < 2) || (b < a) || (b > 1000)
    blt $s1,2,b_mal
    blt $s1,$s0,b_mal
    bgt $s1,1000,b_mal
    j fin_do 

b_mal:
    li $v0,4
    la $a0,msgerr
    syscall
    j do

fin_do:
    
    # Bucle exterior: i desde inferior hasta superior
    move $s2,$s0  # $s2 = i
for1:
    bgt $s2,$s1,finfor1
    li $s4,1      # $s4 = esPrimo = true
    li $s3,2      # $s3 = j = 2

    # Bucle interior: verificar si i es divisible por j
for2:
    bge $s3,$s2,finfor2
    div $s2,$s3
    mfhi $t0      # $t0 = i % j
    bnez $t0,finif
    li $s4,0      # esPrimo = false
    j finfor2     # break bucle interior
finif:
    addi $s3,1
    j for2

finfor2:
    # Si esPrimo imprimir i
    bne $s4,1,finif2
    li $v0,1
    move $a0,$s2
    syscall
    li $v0,11
    li $a0,32     # Espacio ' '
    syscall

finif2:
    addi $s2,1
    j for1

finfor1:
    # Fin del programa
    li $v0,4
    la $a0,msgfin
    syscall
    li $v0,10
    syscall