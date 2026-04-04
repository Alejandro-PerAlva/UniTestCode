.data

f1:	.word	3
c1:	.word	3
mat1:
	.double	-24.889, 96.682, 48.902,
	.double	22.859, 38.792, -50.634,
	.double	23.377, 22.515, -53.737

f2:	.word	8
c2:	.word	5
mat2:	.double	17.398, -64.737, 87.92, -43.583, -65.409,
	.double	-6.281, -26.854, -72.804, 42.372, -92.196,
	.double	94.358, -12.407, -35.939, -37.41, 57.646,
	.double	19.794, 42.452, 63.236, -91.322, -26.431,
	.double	-42.45, -53.94, 91.52, -14.213, -95.806,
	.double	24.553, 37.837, -41.701, -50.17, -95.97,
	.double	89.555, -32.748, -30.354, -62.494, 8.403,
	.double	-82.708, -77.973, 40.233, 6.65, -51.236

f3:	.word	4
c3:	.word	9
mat3:	.double	-35.67, -17.962, 64.583, -76.465, 57.848, 34.164, 64.766, 35.301, -62.31,
	.double	71.197, -81.711, -11.21, 69.955, 18.382, 12.366, 48.926, -38.619, -79.318,
	.double	-71.465, 77.42, 89.622, 12.849, 51.772, 88.375, 59.922, 20.576, 6.546,
	.double	-3.769, 48.463, -28.636, 55.664, 41.943, -5.08, 18.262, 49.093, -93.235

strTitulo:	.asciiz	"\nCuantas filas con mayores\n"
strIntroMatriz:	.asciiz	"\nIntroduce matriz a estudiar (1, 2 o 3), 0 para salir): "
strMalMatiz:	.asciiz	"Numero de matriz incorrecto.\n"
strIntroX:	.asciiz	"Introduce numero a comparar: "
strTermina:	.asciiz	"\nTermina el programa\n"


	.text

mayor_vector:
	li.d	$f4,-1.0e30

	move	$t0,$zero
mayor_vector_forI:
	bge	$t0,$a1,mayor_vector_forI_fin

mayor_vector_ifVecMayor:
	mul	$t2,$t0, 8       # Sustituido sizeD por 8 (bytes de un double)
	add	$t2,$a0,$t2
	l.d	$f6,0($t2)
	c.le.d	$f6,$f4
	bc1t	mayor_vector_ifVecMayor_fin

	mov.d	$f4,$f6

mayor_vector_ifVecMayor_fin:

	addi	$t0,1
	b	mayor_vector_forI
mayor_vector_forI_fin:
	mov.d	$f0,$f4
	jr	$ra
mayor_vector_fin:

filas_con_mayores:

	addi	$sp,$sp,-32
	sw	$ra,0($sp)
	sw	$s0,4($sp)
	sw	$s1,8($sp)
	sw	$s2,12($sp)
	sw	$s3,16($sp)
	sw	$s4,20($sp)
	s.d	$f20,24($sp)

	mov.d	$f20,$f12
	move	$s0,$a0
	move	$s1,$a1
	move	$s2,$a2

	move	$s3,$zero

	move	$s4,$zero
filas_con_mayores_for:
	bge	$s4,$s1,filas_con_mayores_for_fin
	mul	$t1,$s4,$s2
	mul	$t1,$t1, 8       # Sustituido sizeD por 8 (bytes de un double)
	add	$t1,$s0,$t1

	la	$t0,0($t1)

	move	$a0,$t0
	move	$a1,$s2
	jal	mayor_vector
	mov.d	$f16,$f0

filas_con_mayores_ifMayor:
	c.lt.d	$f16,$f20
	bc1t	filas_con_mayores_ifMayor_fin

	addi	$s3,1

filas_con_mayores_ifMayor_fin:

	addi	$s4,1
	b	filas_con_mayores_for
filas_con_mayores_for_fin:

	move	$v0,$s3

	lw	$ra,0($sp)
	lw	$s0,4($sp)
	lw	$s1,8($sp)
	lw	$s2,12($sp)
	lw	$s3,16($sp)
	lw	$s4,20($sp)
	l.d	$f20,24($sp)
	addi	$sp,$sp,32

	jr	$ra
filas_con_mayores_fin:

main:
	li	$v0,4
	la	$a0,strTitulo
	syscall

whileTrue:

	li	$v0,4
	la	$a0,strIntroMatriz
	syscall

	li	$v0,5
	syscall
	move	$s0,$v0

	beqz	$s0,whileTrue_fin

ifNumMatMal:
	bltz	$s0,ifNumMatMal_then
	ble	$s0,3,ifNumMatMal_fin
ifNumMatMal_then:
	li	$v0,4
	la	$a0,strMalMatiz
	syscall

	b	whileTrue
ifNumMatMal_fin:

	li	$v0,4
	la	$a0,strIntroX
	syscall

	li	$v0,7
	syscall
	mov.d	$f20,$f0

switchNumMat:
	beq	$s0,1,switchNumMat_case1
	beq	$s0,2,switchNumMat_case2
	beq	$s0,3,switchNumMat_case3
	b	switchNumMat_fin
switchNumMat_case1:
	la	$s1,mat1
	lw	$s2,f1
	lw	$s3,c1
	b	switchNumMat_fin
switchNumMat_case2:
	la	$s1,mat2
	lw	$s2,f2
	lw	$s3,c2
	b	switchNumMat_fin
switchNumMat_case3:
	la	$s1,mat3
	lw	$s2,f3
	lw	$s3,c3
	b	switchNumMat_fin
switchNumMat_fin:

	mov.d	$f12,$f20
	move	$a0,$s1
	move	$a1,$s2
	move	$a2,$s3
	jal	filas_con_mayores
	move	$s4,$v0
	li	$v0,1
	move	$a0,$s4
	syscall

	b	whileTrue
whileTrue_fin:

	li	$v0,4
	la	$a0,strTermina
	syscall

	li	$v0,10
	syscall