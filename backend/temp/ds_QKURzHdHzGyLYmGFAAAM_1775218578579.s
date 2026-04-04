
.text
j main
# --- INICIO DEL CODIGO --- 

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

# valIniD = 111.11 no se puede definir con punto
# incD = 3.33 no se puede definir con punto

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
	li	$fp,11104

	# Ponemos los salvados del copro $f20-$f30 a valor conocido pero raro
	l.d $f20, _auto_double_0
	l.d $f22, _auto_double_1
	l.d $f24, _auto_double_2
	l.d $f26, _auto_double_3
	l.d $f28, _auto_double_4
	l.d $f30, _auto_double_5

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

	l.s $f0, _auto_float_0
	l.s $f1, _auto_float_1
	l.s $f2, _auto_float_2
	l.s $f3, _auto_float_3
	l.s $f4, _auto_float_4
	l.s $f5, _auto_float_5
	l.s $f6, _auto_float_6
	l.s $f7, _auto_float_7
	l.s $f8, _auto_float_8
	l.s $f9, _auto_float_9
	l.s $f10, _auto_float_10
	l.s $f11, _auto_float_11
	l.s $f16, _auto_float_12
	l.s $f17, _auto_float_13
	l.s $f18, _auto_float_14
	l.s $f19, _auto_float_15

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
strDist8:	.asciiz	"\n*** Registro $fp modificado ***\n"

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

	beq	$fp,11104,finS8
	li	$v0,4
	la	$a0,strDist8
	syscall
finS8:

	# Comprobamos ahora los flotantes

	l.d $f4, _auto_double_6
	c.eq.d	$f20,$f4
	bc1t	fin20
	li	$v0,4
	la	$a0,strDist20
	syscall
fin20:

	l.d $f4, _auto_double_7
	c.eq.d	$f22,$f4
	bc1t	fin22
	li	$v0,4
	la	$a0,strDist22
	syscall
fin22:

	l.d $f4, _auto_double_8
	c.eq.d	$f24,$f4
	bc1t	fin24
	li	$v0,4
	la	$a0,strDist24
	syscall
fin24:

	l.d $f4, _auto_double_9
	c.eq.d	$f26,$f4
	bc1t	fin26
	li	$v0,4
	la	$a0,strDist26
	syscall
fin26:

	l.d $f4, _auto_double_10
	c.eq.d	$f28,$f4
	bc1t	fin28
	li	$v0,4
	la	$a0,strDist28
	syscall
fin28:

	l.d $f4, _auto_double_11
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

#    /* // Tambien se puede hacer con if - else
#    int resultado = 0;
#    if (criterio == 1) {
#         if (a <= b) resultado = 1;
#    } else if (criterio == 2) {
#         if (a >= b) resultado = 1;
#    }  */
#    return(resultado);
# }
# $f12 double a
# $f14 double b
# $a0 criterio
# devuelve $v0 resultado
comparacion:
    li $v0, 0
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

vector1:	.double 1.25, -0.5, 1.0, 3.0, -2.5, 4.5, 7.0, -8.0, 2.0, -3.5
N1:		.word	10

vector2:	.double 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0
N2:		.word	9

vector3:	.double -1.0, -2.0, -3.0, -4.0, -5.0, -6.0, -7.0, -8.0
N3:		.word	8

vector4:	.double	58.608, 73.13, -83.982, -83.122, 83.514, -11.788, 39.17,
		.double -13.826, -22.79, 68.811, -33.615, 72.039, 92.154, 82.963, -75.165
N4:		.word	15

vector5:	.double 0.0
N5:		.word	0

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

	move	$fp,$v0

	li	$v0,4
	la	$a0,strResultado
	syscall
	li	$v0,1
	move	$a0,$fp
	syscall

	b	while_true
while_true_fin:
	li	$v0,4
	la	$a0,strTermina
	syscall

	li	$v0,10
	syscall

# --- TRADUCCION AUTOMATICA SPIM A MARS ---
.data
_auto_double_0: .double 111.0625
_auto_double_1: .double 222.125
_auto_double_2: .double 333.1875
_auto_double_3: .double 444.25
_auto_double_4: .double 555.3125
_auto_double_5: .double 666.375
_auto_double_6: .double 111.0625
_auto_double_7: .double 222.125
_auto_double_8: .double 333.1875
_auto_double_9: .double 444.25
_auto_double_10: .double 555.3125
_auto_double_11: .double 666.375
_auto_float_0: .float -33456.98712
_auto_float_1: .float -33456.98712
_auto_float_2: .float -33456.98712
_auto_float_3: .float -33456.98712
_auto_float_4: .float -33456.98712
_auto_float_5: .float -33456.98712
_auto_float_6: .float -33456.98712
_auto_float_7: .float -33456.98712
_auto_float_8: .float -33456.98712
_auto_float_9: .float -33456.98712
_auto_float_10: .float -33456.98712
_auto_float_11: .float -33456.98712
_auto_float_12: .float -33456.98712
_auto_float_13: .float -33456.98712
_auto_float_14: .float -33456.98712
_auto_float_15: .float -33456.98712
