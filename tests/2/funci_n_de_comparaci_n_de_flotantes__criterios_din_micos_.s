# Programa para probar la función eleva

## Funciones auxiliares de comprobación ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

	.data
valorSP:	.word	0	# Guardar valor pila antes llamada
valorRA:	.word	0	# Guardar $ra al comprobar
# Todo lo que puede ser parámetros de salida de función
valorV0:	.word	0
valorV1:	.word	0
valorF0:	.double	0.0
valorF2:	.double	0.0
valorA0:	.word	0
	.text

# #########################################################
iniciaSalvados:
	# Ponemos los	$s# a valor conocido pero raro
	li	$s0,11000
	li	$s1,11013
	li	$s2,11026
	li	$s3,11039
	li	$s4,11052
	li	$s5,11065
	li	$s6,11078
	li	$s7,11091
	li	$s8,11104

	# Ponemos los salvados del copro $f20-$f30 a valor conocido pero raro
	li.d	$f20,111.0625
	li.d	$f22,222.125
	li.d	$f24,333.1875
	li.d	$f26,444.25
	li.d	$f28,555.3125
	li.d	$f30,666.375

	# Comprobaciones de la pila
	sw	$sp,valorSP	# dirección cabecera pila
	li	$t0,113354
	sw	$t0,0($sp)	# Marca en cabecera de la pila

	# Borramos los temporales y parametros salida
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

# #########################################################
	.data
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

	.text
compruebaSalvados:
	sw	$ra,valorRA	# guarda $ra sin usar pila
	# Guardamos todo lo que puede ser parámetro salida función
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

	# Comprobamos ahora los flotantes

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
	# Pila no equilibrada
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

	# Recuperamos todo lo que puede ser parámetro salida función
	lw	$v0,valorV0
	lw	$v1,valorV1
	l.d	$f0,valorF0
	l.d	$f2,valorF2
	lw	$a0,valorA0
	lw	$ra,valorRA	# guarda $ra sin usar pila
	jr	$ra

## Funciones auxiliares de comprobación ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

# ########################################################
# // realiza la comparación entre a y b segun dos criterios diferentes
# // si criterio es 1 realiza la comparacion a<=b,
# // si criterio es 2 realiza la comparacion a>=b
# // se devuelve 1 si la comparacion fue cierta segun el criterio y 0 en caso contrario
# // tambien devuelve 0 si se paso un criterio no valido
# int comparacion( double a, double b,int criterio) {

#    int resultado = (criterio == 1) && (a<=b) || (criterio ==2) && (a>=b);
#    return(resultado);
# }
# $f12 double a
# $f14 double b
# $a0 criterio
# devuelve $v0 resultado
comparacion:
    li $v0,0
    bne $a0,1,else_criterio1
        c.le.d $f12,$f14
        bc1f else_criterio2
        li $v0,1
        j else_criterio2
    else_criterio1:
    bne $a0,2,else_criterio2
        c.le.d $f14,$f12
        bc1f else_criterio2
        li $v0,1
    else_criterio2:
    jr $ra
comparacion_fin:

# ########################################################
	.data
strSigueDebajo:	.asciiz	"\nRutina no regresa adecuadamente. TERMINAMOS.\n"
	.text
	la	$a0,strSigueDebajo
	li	$v0,4
	syscall

	li	$v0,10
	syscall

# ####################################################################
	.data

strTitulo:	.asciiz	"\nMEDIA Y MEDIANA DE UN VECTOR\n"
strIntroCrit:	.asciiz	"\n\nIntroduce criterio (-5 terminar): "
strIntroX1:	.asciiz	"Introduce primer double: "
strIntroX2:	.asciiz	"Introduce segundo double: "
strTermina:	.asciiz	"\nTermina el programa\n"
strResultado:	.asciiz "\nResultado comparacion: "
strNL:		.asciiz	"\n"

	.text
main:
	li	$v0,4
	la	$a0,strTitulo
	syscall

while_true:

	li	$v0,4
	la	$a0,strIntroCrit
	syscall

	li	$v0,5
	syscall
	move	$s0,$v0

	beq	$s0,-5,while_true_fin

	li	$v0,4
	la	$a0,strIntroX1
	syscall
	li	$v0,7
	syscall
	mov.d	$f20,$f0

	li	$v0,4
	la	$a0,strIntroX2
	syscall
	li	$v0,7
	syscall
	mov.d	$f22,$f0

	move	$a0,$s0
	mov.d	$f12,$f20
	mov.d	$f14,$f22

	jal	iniciaSalvados
	jal	comparacion
	jal	compruebaSalvados

	move	$s8,$v0

	li	$v0,4
	la	$a0,strResultado
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