.data

vector1:	.double 1.25, -0.5, 1.0, 3.0, -2.5, 4.5, 7.0, -8.0, 2.0, -3.5
N1:		.word	10

vector2:	.double 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0
N2:		.word	9

vector3:	.double -1.0, -2.0, -3.0, -4.0, -5.0, -6.0, -7.0, -8.0
N3:		.word	8

vector4:	.double	92.154,  83.514,  82.963,  73.13 ,  72.039,  68.811,  58.608,
		.double 39.17 , -11.788, -13.826, -22.79 , -33.615, -75.165, -83.122,
		.double -83.982
N4:		.word	15

vector5:	.double 0.0
N5:		.word	0

strTitulo:	.asciiz	"\nCOMPRUEBA FUNCION ordenado\n"
strIntroMatriz:	.asciiz	"\nIntroduce vector a estudiar 1 - 5 (0 para salir): "
str_OrdenadoDevuelve:	.asciiz	"\nOrdenado devuelve: "
strTermina:	.asciiz	"\nTermina el programa\n"
str_printvec:   .asciiz "\nVector con dimension "

strComprueba:	.asciiz	"\nHACEMOS COMPROBACIONES\n"
strDist0:	.asciiz	"\n*** Registro $s0 modificado ***\n"
strDist1:	.asciiz	"\n*** Registro $s1 modificado ***\n"
strDist2:	.asciiz	"\n*** Registro $s2 modificado ***\n"
strDist3:	.asciiz	"\n*** Registro $s3 modificado ***\n"
strDist4:	.asciiz	"\n*** Registro $s4 modificado ***\n"
strDist5:	.asciiz	"\n*** Registro $s5 modificado ***\n"
strDist6:	.asciiz	"\n*** Registro $s6 modificado ***\n"
strDist7:	.asciiz	"\n*** Registro $s7 modificado ***\n"
strDist8:	.asciiz	"\n*** Registro $s8 modificado ***\n"

strDist20:	.asciiz	"\n*** Registro $f20 y/o $f21 modificado ***\n"
strDist22:	.asciiz	"\n*** Registro $f22 y/o $f23 modificado ***\n"
strDist24:	.asciiz	"\n*** Registro $f24 y/o $f25 modificado ***\n"
strDist26:	.asciiz	"\n*** Registro $f26 y/o $f27 modificado ***\n"
strDist28:	.asciiz	"\n*** Registro $f28 y/o $f29 modificado ***\n"
strDist30:	.asciiz	"\n*** Registro $f30 y/o $f31 modificado ***\n"

strSPModif:	.asciiz	"\n*** Pila no equilibrada ***\n"
strDistPila:	.asciiz	"\n*** Cabecera Pila modificada ***\n"

valorSP:	.word	0
valorRA:	.word	0
valorV0:	.word	0
valorV1:	.word	0
valorF0:	.double	0.0
valorF2:	.double	0.0
valorA0:	.word	0


	.text

# ####################################################################
# Rutinas del Alumno
# ####################################################################

ordenado:
    li $v0,1 # resultado = 1
    li $t0,0
    addi $a1,-1 # n-1
    while_ordenado: 
        bge $t0,$a1,fin_while_ordenado
        l.d $f4,0($a0) # f4 v[i]
        l.d $f6,8($a0) # f6 v[i+1]
        c.le.d $f4,$f6
        bc1f next_ordenado
            li $v0,0
            j fin_while_ordenado
        next_ordenado:
        addi $t0,1
        addi $a0,8
        j while_ordenado
    fin_while_ordenado:
    jr $ra
ordenado_fin:

printvec:
    # PUSH
    addi $sp,-16
    sw $s0,0($sp)
    sw $s1,4($sp)
    sw $s2,8($sp)
    sw $ra,12($sp)
    move $s0,$a0 # dir vector
    move $s1,$a1 # num eltos

    li $v0,4
    la $a0,str_printvec
    syscall
    li $v0,1
    move $a0,$s1
    syscall
    li $v0,11
    li $a0,'\n'
    syscall
    
    li $s2, 0 # $s2 = i iterador del bucle
printvec_for:   
    bge $s2,$s1,fin_printvec_for
    l.d $f12,0($s0)
    li $v0,3
    syscall
    li $a0,' '
    li $v0,11
    syscall
    addi $s2,1
    addi $s0,8
    j printvec_for
fin_printvec_for:
    li $v0,11
    li $a0,'\n'
    syscall
    # POP
    lw $s0,0($sp)
    lw $s1,4($sp)
    lw $s2,8($sp)
    lw $ra,12($sp)
    addi $sp,16
    jr $ra
printvec_fin:


# ####################################################################
# main
# ####################################################################
main:
	li	$v0,4
	la	$a0,strTitulo
	syscall

while_true:
	li	$v0,4
	la	$a0,strIntroMatriz
	syscall

	li	$v0,5
	syscall
	move	$v0,$v0

	beq	$v0,1,caso1
	beq	$v0,2,caso2
	beq	$v0,3,caso3
	beq	$v0,4,caso4
	beq	$v0,5,caso5

	b	while_true_fin

caso1:
	la	$s0,vector1
	lw	$s1,N1
	b	switch_fin
caso2:
	la	$s0,vector2
	lw	$s1,N2
	b	switch_fin
caso3:
	la	$s0,vector3
	lw	$s1,N3
	b	switch_fin
caso4:
	la	$s0,vector4
	lw	$s1,N4
	b	switch_fin
caso5:
	la	$s0,vector5
	lw	$s1,N5
	b	switch_fin

switch_fin:
	move	$a0,$s0
	move	$a1,$s1
	jal	printvec

	move	$a0,$s0
	move	$a1,$s1
	jal	iniciaSalvados
	jal	ordenado
	jal	compruebaSalvados

	move	$s8,$v0

	li	$v0,4
	la	$a0,str_OrdenadoDevuelve
	syscall

	li	$v0,1
	move	$a0,$s8
	syscall

	b	while_true
while_true_fin:
	li	$v0,4
	la	$a0,strTermina
	syscall

	li	$v0,10
	syscall


# ####################################################################
# Rutinas de Comprobacion
# ####################################################################

iniciaSalvados:
	li	$s0,11000
	li	$s1,11013
	li	$s2,11026
	li	$s3,11039
	li	$s4,11052
	li	$s5,11065
	li	$s6,11078
	li	$s7,11091
	li	$s8,11104

	li.d	$f20,111.0625
	li.d	$f22,222.125
	li.d	$f24,333.1875
	li.d	$f26,444.25
	li.d	$f28,555.3125
	li.d	$f30,666.375

	sw	$sp,valorSP	
	li	$t0,113354
	sw	$t0,0($sp)	

	li	$t0,1515870810
	li	$t1,1515870810
	li	$t2,1515870810
	li	$t3,1515870810
	li	$t4,1515870810
	li	$t5,1515870810
	li	$t6,1515870810
	li	$t7,1515870810
	li	$t8,1515870810
	li	$t9,1515870810
	li	$v0,1515870810
	li	$v1,1515870810

	li.s	$f0,-33456.98712
	li.s	$f1,-33456.98712
	li.s	$f2,-33456.98712
	li.s	$f3,-33456.98712
	li.s	$f4,-33456.98712
	li.s	$f5,-33456.98712
	li.s	$f6,-33456.98712
	li.s	$f7,-33456.98712
	li.s	$f8,-33456.98712
	li.s	$f9,-33456.98712
	li.s	$f10,-33456.98712
	li.s	$f11,-33456.98712
	li.s	$f16,-33456.98712
	li.s	$f17,-33456.98712
	li.s	$f18,-33456.98712
	li.s	$f19,-33456.98712

	jr	$ra

compruebaSalvados:
	sw	$ra,valorRA	
	sw	$v0,valorV0
	sw	$v1,valorV1
	s.d	$f0,valorF0
	s.d	$f2,valorF2
	sw	$a0,valorA0

	li	$v0,4
	la	$a0,strComprueba
	syscall

	beq	$s0,11000,finS0
	li	$v0,4
	la	$a0,strDist0
	syscall
finS0:

	beq	$s1,11013,finS1
	li	$v0,4
	la	$a0,strDist1
	syscall
finS1:

	beq	$s2,11026,finS2
	li	$v0,4
	la	$a0,strDist2
	syscall
finS2:

	beq	$s3,11039,finS3
	li	$v0,4
	la	$a0,strDist3
	syscall
finS3:

	beq	$s4,11052,finS4
	li	$v0,4
	la	$a0,strDist4
	syscall
finS4:

	beq	$s5,11065,finS5
	li	$v0,4
	la	$a0,strDist5
	syscall
finS5:

	beq	$s6,11078,finS6
	li	$v0,4
	la	$a0,strDist6
	syscall
finS6:

	beq	$s7,11091,finS7
	li	$v0,4
	la	$a0,strDist7
	syscall
finS7:

	beq	$s8,11104,finS8
	li	$v0,4
	la	$a0,strDist8
	syscall
finS8:

	li.d	$f4,111.0625
	c.eq.d	$f20,$f4
	bc1t	fin20
	li	$v0,4
	la	$a0,strDist20
	syscall
fin20:

	li.d	$f4,222.125
	c.eq.d	$f22,$f4
	bc1t	fin22
	li	$v0,4
	la	$a0,strDist22
	syscall
fin22:

	li.d	$f4,333.1875
	c.eq.d	$f24,$f4
	bc1t	fin24
	li	$v0,4
	la	$a0,strDist24
	syscall
fin24:

	li.d	$f4,444.25
	c.eq.d	$f26,$f4
	bc1t	fin26
	li	$v0,4
	la	$a0,strDist26
	syscall
fin26:

	li.d	$f4,555.3125
	c.eq.d	$f28,$f4
	bc1t	fin28
	li	$v0,4
	la	$a0,strDist28
	syscall
fin28:

	li.d	$f4,666.375
	c.eq.d	$f30,$f4
	bc1t	fin30
	li	$v0,4
	la	$a0,strDist30
	syscall
fin30:

	lw	$t2,valorSP
	beq	$sp,$t2,finSPModif
	li	$v0,4
	la	$a0,strSPModif
	syscall

	li	$v0,10
	syscall
finSPModif:

	li	$t0,113354
	lw	$t2,0($sp)
	beq	$t2,$t0,finPila
	li	$v0,4
	la	$a0,strDistPila
	syscall
finPila:

	lw	$v0,valorV0
	lw	$v1,valorV1
	l.d	$f0,valorF0
	l.d	$f2,valorF2
	lw	$a0,valorA0
	lw	$ra,valorRA	
	jr	$ra