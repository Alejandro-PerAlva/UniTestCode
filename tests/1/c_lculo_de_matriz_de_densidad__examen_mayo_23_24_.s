#// Solución Examen Mayo curso 23-24
#// Calculo de matriz de densidad

	.data

mat1:	.word	6
	.word	6
	.float	11.11, 12.12, 13.13, 14.14, 15.15, 16.16,
	.float	21.21, 22.22, 23.23, 24.24, 25.25, 26.26,
	.float	31.31, 32.32, 33.33, 34.34, 35.35, 36.36,
	.float	41.41, 42.42, 43.43, 44.44, 45.45, 46.46,
	.float	51.51, 52.52, 53.53, 54.54, 55.55, 56.56,
	.float	61.61, 62.62, 63.63, 64.64, 65.65, 66.66

mat2:	.word	7
	.word	10
	.float	-36.886, -58.201,  78.671,  19.092, -50.781,  33.961, -59.511, 12.347,  57.306,  -1.938,
	.float	-86.858, -81.852,  54.623, -22.574,  88.217,  64.374,  52.312, 47.918, -83.549,  19.041,
	.float	4.255, -36.842,  82.526,  27.394,  56.527,  39.448,  18.429, 97.057,  76.933,  14.583,
	.float	67.79 ,  -9.861, -96.191,  32.369, -18.494, -43.392,  39.857, 80.686, -36.87 , -17.786,
	.float	30.073,  89.938,  -6.889,  64.601, -85.018,  70.559, -48.853, -62.627, -60.147,  -5.524,
	.float	84.323, -51.718,  93.127, -10.757,  32.119,  98.214,  69.471, 73.814,   3.724,  57.208,
	.float	-41.528, -17.458, -64.226, -71.297, -98.745,   7.095, -79.112, 33.819,  63.531, -96.181

mat3:	.word	1
	.word	10
	.float	1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0

mat4:	.word	10
	.word	1
	.float	1.0
	.float	2.0
	.float	3.0
	.float	4.0
	.float	5.0
	.float	6.0
	.float	7.0
	.float	8.0
	.float	9.0
	.float	10.0

mat5:	.word	0
	.word	0
	.float	-23.3

matDensidad:	.word	10
	.word	10
	.space	400

str_titulo:	.asciiz	"\nComienza programa de cálculo de densidad de matriz\n"
str_menu:	.ascii	"\n(1) Seleccionar matriz de trabajo.\n"
		.ascii	"(2) Imprimir matriz\n"
		.ascii	"(3) Elegir tamaño del entorno\n"
		.ascii  "(4) Calcular e imprimir matriz de densidad de la matriz seleccionada.\n"
		.ascii	"(5) Imprimir el nombre del autor del programa y la fecha en que fue realizado.\n"
		.ascii  "(0) Salir del programa.\n"
		.asciiz	"\nIntroduce opción elegida: "
str_errorOpc:	.asciiz	"Opción inválida\n"
str_termina:	.asciiz	"\nSaliendo del programa...\n"
str_elijeMat:	.asciiz	"\nSelecciona una matriz (1..5): "
str_numMatMal:	.asciiz	"Numero de matriz de trabajo incorrecto\n"
str_entorno:	.asciiz	"Introduzca el tamaño de entorno que quiere aplicar: "
str_errorEnt:	.asciiz	"Entorno de tamaño no apropiado para la matriz seleccionada.\n"
str_autor:	.asciiz	"Autor: Tu Nombre\n"
str_fecha:	.asciiz	"Fecha: Fecha de realización\n"
str_matTiene:	.asciiz "La matriz tiene dimensión "

.text

print_mat:
	addi	$sp,$sp,-28
	sw	$s0,0($sp)
	sw	$s1,4($sp)
	sw	$s2,8($sp)
	sw	$s3,12($sp)
	sw	$s4,16($sp)
	sw	$ra,20($sp)
	sw	$s5,24($sp)

	move	$s0,$a0

	lw	$s1,0($s0)       # nFil
	lw	$s2,4($s0)       # nCol
	addi	$s5,$s0,8        # Puntero a elementos (base + 8)

	li	$v0,4
	la	$a0,str_matTiene
	syscall

	li	$v0,1
	move	$a0,$s1
	syscall

	li	$v0,11
	li	$a0,'x'
	syscall

	li	$v0,1
	move	$a0,$s2
	syscall

	li	$v0,11
	li	$a0, 10          # Salto de linea
	syscall

	move	$s3,$zero
print_mat_for_f:
	bge	$s3,$s1,print_mat_for_f_fin

	move	$s4,$zero
print_mat_for_c:
	bge	$s4,$s2,print_mat_for_c_fin

	mul	$t0,$s3,$s2
	add	$t0,$t0,$s4
	mul	$t0,$t0, 4       # Tamaño Float
	add	$t0,$s5,$t0

	l.s	$f12,0($t0)
	li	$v0,2
	syscall

	li	$v0,11
	li	$a0,' '
	syscall

	addi	$s4,$s4,1
	b 	print_mat_for_c
print_mat_for_c_fin:
	li	$v0,11
	li	$a0, 10          # Salto de linea
	syscall

	addi	$s3,$s3,1
	b	print_mat_for_f
print_mat_for_f_fin:

	li	$v0,11
	li	$a0, 10          # Salto de linea
	syscall

	lw	$s0,0($sp)
	lw	$s1,4($sp)
	lw	$s2,8($sp)
	lw	$s3,12($sp)
	lw	$s4,16($sp)
	lw	$ra,20($sp)
	lw	$s5,24($sp)
	addi	$sp,$sp,28

	jr	$ra

calcDensidadEntorno:
    li.s $f0, 0.0
    li $t1, -1
    mul $t1, $t1, $a2
calcDens_loop_i:
    bgt $t1, $a2, calcDens_end_i
    li $t2, -1
    mul $t2, $t2, $a2
calcDens_loop_j:
    bgt $t2, $a2, calcDens_end_j

    mul $t3, $t1, $a1
    add $t3, $t3, $t2
    sll $t3, $t3, 2          # * 4
    add $t3, $a0, $t3

    lwc1 $f4, 0($t3)
    add.s $f0, $f0, $f4

    addi $t2, $t2, 1
    j calcDens_loop_j
calcDens_end_j:
    addi $t1, $t1, 1
    j calcDens_loop_i
calcDens_end_i:

	add $t3, $a2, $a2
    addi $t3, $t3, 1
    mul $t3, $t3, $t3
    mtc1 $t3, $f4
    cvt.s.w $f4, $f4

    div.s $f0, $f0, $f4
    jr $ra

calcMatrizDensidad:
    addi $sp, $sp, -20
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    sw $s1, 8($sp)
    sw $s2, 12($sp)
    sw $s3, 16($sp)

    lw $s0, 0($a0)           # nFil
    lw $s1, 4($a0)           # nCol
    addi $t0, $a0, 8         # Puntero a elementos src (base + 8)

    sub $t1, $s0, $a2
    sub $t1, $t1, $a2
    sw $t1, 0($a1)           # Guardar nFil dest

    sub $t2, $s1, $a2
    sub $t2, $t2, $a2
    sw $t2, 4($a1)           # Guardar nCol dest

    li $s2, 0
calcMat_loop_i:
    bge $s2, $t1, calcMat_end_i
    li $s3, 0
calcMat_loop_j:
    bge $s3, $t2, calcMat_end_j

	add $t3, $s2, $a2
    mul $t3, $t3, $s1
    add $t3, $t3, $s3
	add $t3, $t3, $a2
	sll $t3, $t3, 2
    add $t3, $t0, $t3

    addi $sp, $sp, -20
    sw $t0, 0($sp)
    sw $t1, 4($sp)
    sw $t2, 8($sp)
	sw $a1, 12($sp)
	sw $a2, 16($sp)
    
    move $a0, $t3
    move $a1, $s1
    jal calcDensidadEntorno
    
    lw $t0, 0($sp)
    lw $t1, 4($sp)
    lw $t2, 8($sp)
	lw $a1, 12($sp)
	lw $a2, 16($sp)
    addi $sp, $sp, 20

    mul $t3, $s2, $t2
    add $t3, $t3, $s3
	sll $t3, $t3, 2
    addi $t4, $a1, 8         # Puntero a elementos dest (base + 8)
    add $t4, $t3, $t4
    swc1 $f0, 0($t4)

    addi $s3, $s3, 1
    j calcMat_loop_j
calcMat_end_j:
    addi $s2, $s2, 1
    j calcMat_loop_i
calcMat_end_i:

    lw $ra, 0($sp)
    lw $s0, 4($sp)
    lw $s1, 8($sp)
    lw $s2, 12($sp)
    lw $s3, 16($sp)
    addi $sp, $sp, 20
    jr $ra

main:
	li	$v0,4
	la	$a0,str_titulo
	syscall

	la	$s0,mat1

while_true:
	li	$v0,4
	la	$a0,str_menu
	syscall

	li	$v0,5
	syscall
	move 	$s1,$v0

if_opcion0:
	beqz	$s1,while_true_fin

if_opcion1:
	bne	$s1,1,if_opcion1_fin
	li	$v0,4
	la	$a0,str_elijeMat
	syscall

    li	$v0,5
	syscall

if_MatT1:
	bne	$v0,1,if_MatT1_fin
	la	$s0,mat1
	b	while_true
if_MatT1_fin:

if_MatT2:
	bne	$v0,2,if_MatT2_fin
	la	$s0,mat2
	b	while_true
if_MatT2_fin:

if_MatT3:
	bne	$v0,3,if_MatT3_fin
	la	$s0,mat3
	b	while_true
if_MatT3_fin:

if_MatT4:
	bne	$v0,4,if_MatT4_fin
	la	$s0,mat4
	b	while_true
if_MatT4_fin:

if_MatT5:
	bne	$v0,5,if_MatT5_fin
	la	$s0,mat5
	b	while_true
if_MatT5_fin:

	li	$v0,4
	la	$a0,str_numMatMal
	syscall

	b	while_true
if_opcion1_fin:

if_opcion2:
	bne	$s1,2,if_opcion2_fin
	move	$a0,$s0
	jal	print_mat
	b while_true
if_opcion2_fin:

if_opcion3:
	bne	$s1,3,if_opcion3_fin
    li $v0, 4
    la $a0, str_entorno
    syscall

    li $v0, 5            
    syscall
    move $s2, $v0        
	b while_true
if_opcion3_fin:

if_opcion4:
	bne	$s1,4,if_opcion4_fin
	bltz $s2, error_entorno
	add $t1, $s2, $s2
	addi $t1, $t1, 1   
	lw $t2, 0($s0)           # nFil
	bgt $t1, $t2, error_entorno
	lw $t2, 4($s0)           # nCol
	ble $t1, $t2, end_error_entorno
error_entorno:
	li $v0, 4
	la $a0, str_errorEnt
	syscall
	b while_true
end_error_entorno:
	move $a0, $s0
	la $a1, matDensidad
	move $a2, $s2
	jal calcMatrizDensidad

	la $a0, matDensidad
	jal print_mat

	b while_true
if_opcion4_fin:

if_opcion5:
	bne	$s1,5,if_opcion5_fin
	li $v0, 4
	la $a0, str_autor
	syscall
	li $v0, 4
	la $a0, str_fecha
	syscall
	b while_true
if_opcion5_fin:

	li	$v0,4
	la	$a0,str_errorOpc
	syscall

	b	while_true
while_true_fin:

	li	$v0,4
	la	$a0,str_termina
	syscall

	li		$v0,10
	syscall