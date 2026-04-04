.data
strTitulo:	.asciiz	"\nCosto viaje"
strIntroKm:	.asciiz	"\n\nIntroduce Km del viaje (entero): "
strIntroLitro:	.asciiz	"Introduce los Km por litro (entero): "
strPrecio:	.asciiz	"Introduce el precio por litro: "
strPresupuesto:	.asciiz	"Introduce el presupuesto: "
srtRecorrido:	.asciiz	"El recorrido de "
strSupone:	.asciiz	" Km supone un costo de "
strSupera:	.asciiz	"\nSupera el presupuesto"
strTermina:	.asciiz	"\nTermina el programa\n"

	.text

main:
	# Imprimir título inicial
	li	$v0,4
	la	$a0,strTitulo
	syscall

while_true:
	# Pedir Km del viaje
	li	$v0,4
	la	$a0,strIntroKm
	syscall
	li	$v0,5
	syscall
	move	$s0,$v0

	# Comprobar condición de salida (Kms <= 0)
ifKms_0:
	bgtz	$s0,ifKms_0_fin
	b	while_true_fin
ifKms_0_fin:

	# Pedir Kms por litro
	li	$v0,4
	la	$a0,strIntroLitro
	syscall
	li	$v0,5
	syscall
	move	$s1,$v0

	# Pedir precio por litro (float)
	li	$v0,4
	la	$a0,strPrecio
	syscall
	li	$v0,6
	syscall
	mov.s	$f20,$f0

	# Pedir presupuesto (float)
	li	$v0,4
	la	$a0,strPresupuesto
	syscall
	li	$v0,6
	syscall
	mov.s	$f22,$f0

	# Conversiones de entero a float simple
	mtc1	$s0,$f4
	cvt.s.w	$f4,$f4		# $f4 = (float) Kms

	mtc1	$s1,$f6
	cvt.s.w	$f6,$f6		# $f6 = (float) KmsPorLitro

	# Calcular el costo
	div.s	$f24,$f4,$f6
	mul.s	$f24,$f24,$f20

	# Imprimir mensaje de recorrido
	li	$v0,4
	la	$a0,srtRecorrido
	syscall
	li	$v0,1
	move	$a0,$s0
	syscall
	li	$v0,4
	la	$a0,strSupone
	syscall
	li	$v0,2
	mov.s	$f12,$f24
	syscall

	# Comprobar si supera el presupuesto
ifCosto:
	c.le.s	$f24,$f22
	bc1t	ifCosto_fin

	li	$v0,4
	la	$a0,strSupera
	syscall

ifCosto_fin:
	b	while_true

while_true_fin:
	# Mensaje de terminación y salida
	li	$v0,4
	la	$a0,strTermina
	syscall

	li	$v0,10
	syscall