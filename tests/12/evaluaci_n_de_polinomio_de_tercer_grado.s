.data
strTitulo:	.ascii	"\nEvaluacion polinomio f(x) = a x^3 + b x^2 + c x + d"
		.asciiz	" en un intervalo [r,s]\n"
strIntroA:	.asciiz	"\nIntroduzca coeficiente a: "
strIntroB:	.asciiz	"Introduzca coeficiente b: "
strIntroC:	.asciiz	"Introduzca coeficiente c: "
strIntroD:	.asciiz	"Introduzca coeficiente d: "

strIntroR:	.asciiz	"\nLímite inferior r: "
strIntroS:	.asciiz	"Límite superior s: "

strF:		.asciiz	"\nf("
strIgual:	.asciiz	") = "
strTermina:	.asciiz	"\n\nTermina el programa\n"

	.text
main:
	# Imprimir Título
	li	$v0,4
	la	$a0,strTitulo
	syscall

	# Pedir coeficiente A
	li	$v0,4
	la	$a0,strIntroA
	syscall
	li	$v0,6
	syscall
	mov.s	$f20,$f0

	# Pedir coeficiente B
	li	$v0,4
	la	$a0,strIntroB
	syscall
	li	$v0,6
	syscall
	mov.s	$f22,$f0

	# Pedir coeficiente C
	li	$v0,4
	la	$a0,strIntroC
	syscall
	li	$v0,6
	syscall
	mov.s	$f24,$f0

	# Pedir coeficiente D
	li	$v0,4
	la	$a0,strIntroD
	syscall
	li	$v0,6
	syscall
	mov.s	$f26,$f0

doWhile:
	# Pedir límite R
	li	$v0,4
	la	$a0,strIntroR
	syscall
	li	$v0,5
	syscall
	move	$s0,$v0

	# Pedir límite S
	li	$v0,4
	la	$a0,strIntroS
	syscall
	li	$v0,5
	syscall
	move	$s1,$v0

	# while (r > s);
	bgt	$s0,$s1,doWhile
doWhile_fin:

	# for (int x = r ; x <= s ; x++)
	move	$s2,$s0
forX:
	bgt	$s2,$s1,forX_fin

	# Convertir X (int) a float ($f4)
	mtc1	$s2,$f4
	cvt.s.w	$f4,$f4

	# Evaluacion Polinomio
	mov.s	$f28,$f26	# f = d
	
	mul.s	$f6,$f24,$f4	# $f6 = c*x
	add.s	$f28,$f28,$f6	# f += c*x

	mul.s	$f8,$f4,$f4	# y = x*x
	mul.s	$f6,$f22,$f8	# $f6 = b*x*x
	add.s	$f28,$f28,$f6	# f += b*x*x

	mul.s	$f8,$f8,$f4	# y = (x*x)*x
	mul.s	$f6,$f20,$f8	# $f6 = a*x*x*x
	add.s	$f28,$f28,$f6	# f += a*x*x*x

	# if (f >= 2.5)
ifF:
	li.s	$f8,2.5
	c.lt.s	$f28,$f8
	bc1t	ifF_fin

	# Imprimir f(x) = f
	li	$v0,4
	la	$a0,strF
	syscall

	li	$v0,1
	move	$a0,$s2
	syscall

	li	$v0,4
	la	$a0,strIgual
	syscall

	li	$v0,2
	mov.s	$f12,$f28
	syscall

ifF_fin:
	addi	$s2,1
	b	forX
forX_fin:

	li	$v0,4
	la	$a0,strTermina
	syscall

	li	$v0,10
	syscall