.data
strTitulo:	.asciiz	"\nPrograma que cuenta el numero de veces que aparece un digito en numero entero positivo.\n"
strIntroNum:	.asciiz	"\nIntroduzca un numero entero positivo (negativo para finalizar el programa): "
strIntroDig:	.asciiz	"Introduzca un digito (0-9): "
strVeces:	.asciiz	"El numero de veces que aparece el digito en el numero es: "
strFin:		.asciiz	"\nFin del programa.\n"

	.text

main:
	li	$v0,4
	la	$a0,strTitulo
	syscall

whileTrue:
	li	$v0,4
	la	$a0,strIntroNum
	syscall

	li	$v0,5
	syscall
	move	$s0,$v0

ifNumeroNega:
	bltz	$s0,ifNumeroNega_then
	b	ifNumeroNega_fin
ifNumeroNega_then:
	b	whileTrue_fin
ifNumeroNega_fin:

doWhileDigito:
	li	$v0,4
	la	$a0,strIntroDig
	syscall

	li	$v0,5
	syscall
	move	$s1,$v0

	bltz	$s1,doWhileDigito
	bgt	$s1,9,doWhileDigito
doWhileDigito_fin:

	move	$s3,$zero

dowhileNumero0:
	li	$t3,10
	div	$s0,$t3

	mflo	$s0
	mfhi	$t1

ifRestoDigito:
	bne	$t1,$s1,ifRestoDigito_fin
	addi	$s3,1
ifRestoDigito_fin:
	bne	$s0,$zero,dowhileNumero0
dowhileNumero0_fin:

	li	$v0,4
	la	$a0,strVeces
	syscall

	li	$v0,1
	move	$a0,$s3
	syscall

	li	$v0,11
	li	$a0,10
	syscall

	b	whileTrue
whileTrue_fin:

	li	$v0,4
	la	$a0,strFin
	syscall

	li	$v0,10
	syscall