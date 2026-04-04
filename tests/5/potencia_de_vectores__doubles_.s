.data

v1Largo:	.word 10
v1:		.double	-3.125,  8.875,  7.6875, -0.71875, -5.25, -3.875
		.double	-3.3125, -0.375,  0.140625, 0.96875

v2Largo:	.word 6
v2:		.double -1.03125,  5.640625,  2.953125, -1.625, -2.90625, -0.25

v3Largo:	.word	0
v3:		.double -65535.0

str_titulo:	.asciiz	"\nPotencia Vectores Doubles\n"
str_elige:	.asciiz	"\nElige vector 1, 2, 3 o 0 para terminar: "
str_incorrecta:	.asciiz	"Opción incorrecta"
str_introexpo:	.asciiz	"Introduce exponente: "
str_lasumaes:	.asciiz	"\nLa suma es "
str_termina:	.asciiz	"\nTermina el programa\n"

	.text
	.globl eleva
	.globl potencia_vect

eleva:
	li.d	$f0,1.0
	li	$t0,1
eleva_for:
	bgt	$t0,$a0,eleva_for_fin
	mul.d	$f0,$f0,$f12
	addi	$t0,1
	b	eleva_for
eleva_for_fin:
	jr	$ra
eleva_fin:

potencia_vect:
	addi	$sp,-28
	sw	$ra,0($sp)
	sw	$s0,4($sp)
	sw	$s1,8($sp)
	sw	$s2,12($sp)
	s.d	$f20,16($sp)
	sw	$s3,24($sp)

	move	$s0,$a0
	move	$s1,$a1
	move	$s2,$a2

	li.d 	$f20,0.0
	move	$s3,$zero
potencia_vect_for:
	bge	$s3,$s1,potencia_vect_for_fin

	mul	$t0,$s3,8
	addu	$t0,$t0,$s0
	l.d	$f12,0($t0)

	move	$a0,$s2
	jal	eleva

	mul	$t0,$s3,8
	addu	$t0,$t0,$s0
	s.d 	$f0,0($t0)

	add.d 	$f20,$f20,$f0

	addi	$s3,1
	b	potencia_vect_for
potencia_vect_for_fin:
	mov.d	$f0,$f20

	lw	$ra,0($sp)
	lw	$s0,4($sp)
	lw	$s1,8($sp)
	lw	$s2,12($sp)
	l.d	$f20,16($sp)
	lw	$s3,24($sp)
	addi	$sp,28

	jr	$ra
potencia_vect_fin:

printvec:
	bnez	$5,printvec__pv_nozero__
	addi	$29,-4
	sw	$31,0($29)
	ori	$2,$0,11
	ori	$4,$0,10
	syscall
	lw	$31,0($29)
	addi	$29,4
	jr	$31
printvec__pv_nozero__:
	addi	$29,-12
	sw	$31,0($29)
	sw	$16,4($29)
	sw	$17,8($29)
	addu	$16,$0,$4
	addu	$17,$0,$5
	ldc1	$f12,0($16)
	ori	$2,$0,3
	syscall
	ori	$4,$0,32
	ori	$2,$0,11
	syscall
	add	$4,$16,8
	add	$5,$17,-1
	jal	printvec
	lw	$31,0($29)
	lw	$16,4($29)
	lw	$17,8($29)
	addi	$29,12
	jr	$31
printvec_fin:

main:
	li	$v0,4
	la	$a0,str_titulo
	syscall

while_true:
	li	$v0,4
	la	$a0,str_elige
	syscall

	li	$v0,5
	syscall
	move	$s0,$v0

	beqz	$s0,while_true_fin

if_opcionValida:
	bltz	$s0,if_opcionValida_then
	ble	$s0,3,if_opcionValida_fin
if_opcionValida_then:
	li	$v0,4
	la	$a0,str_incorrecta
	syscall

	b	while_true
if_opcionValida_fin:
	la	$s1,v1
	lw	$s2,v1Largo
if_opcion2:
	bne	$s0,2,if_opcion2_fin
	la	$s1,v2
	lw	$s2,v2Largo
if_opcion2_fin:

if_opcion3:
	bne	$s0,3,if_opcion3_fin
	la	$s1,v3
	lw	$s2,v3Largo
if_opcion3_fin:

	li	$v0,4
	la	$a0,str_introexpo
	syscall

	li	$v0,5
	syscall
	move	$s3,$v0

	move	$a0,$s1
	move	$a1,$s2
	jal	printvec

	move	$a0,$s1
	move	$a1,$s2
	move 	$a2,$s3
	jal	potencia_vect
	mov.d	$f20,$f0

	li	$v0,4
	la	$a0,str_lasumaes
	syscall

	li	$v0,3
	mov.d	$f12,$f20
	syscall

	li	$v0,11
	li	$a0,'\n'
	syscall

	move	$a0,$s1
	move	$a1,$s2
	jal	printvec

	b	while_true
while_true_fin:
	li	$v0,4
	la	$a0,str_termina
	syscall

	li	$v0,10
	syscall