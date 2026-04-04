.data

mat1:	.word 6
	.word 6
	.float 11.11, 12.12, 13.13, 14.14, 15.15, 16.16
	.float 21.21, 22.22, 23.23, 24.24, 25.25, 26.26
	.float 31.31, 32.32, 33.33, 34.34, 35.35, 36.36
	.float 41.41, 42.42, 43.43, 44.44, 45.45, 46.46
	.float 51.51, 52.52, 53.53, 54.54, 55.55, 56.56
	.float 61.61, 62.62, 63.63, 64.64, 65.65, 66.66

mat2:	.word 7
	.word 10
	.float -36.886, -58.201, 78.671, 19.092, -50.781, 33.961, -59.511
	.float 12.3125, 57.306, -1.938, -86.858, -81.852,  54.623, -22.574
	.float 88.217, 64.374, 52.875, 47.918, -83.549,  19.041, 4.255, -31.875
	.float 82.526,  27.394, 56.527, 39.448,  18.429, 97.057,  76.933
	.float 14.583, 67.79, -9.861, -97.875, 32.369, -18.494, -43.392, 39.857 
	.float 87.65625, -31.875, -17.786, 30.073,  87.65625,  -6.889,  64.601
	.float -85.018,  70.559, -48.853, -62.627, -60.147,  -5.524, 84.323
	.float -51.718,  93.127, -10.757,  32.119, 98.3125, 69.471, 73.814
	.float 3.724,  57.208, -41.528, -17.458, -64.226, -71.297, -97.875
	.float 7.095, -79.112, 33.819,  63.531, -96.181

mat3:	.word 1
	.word 8
	.float -36.52,  35.3 ,  79.05, -58.69, -55.23, -19.44, -88.63, -93.61

mat4:	.word 16
	.word 1
	.float -90.57, -65.11, -58.21, -73.23, -89.38, -79.25,  16.82,  66.3
	.float -96.14, -97.16, -24.66,   5.27, -33.5 , -13.09,  27.13, -74.83

mat5:	.word 1
	.word 1
	.float 78.98

mat6:	.word 0
	.word 0
	.float 0.0

mat7:	.word 0
	.word 0
	.space 400		# MAXELTOS(100) * sizeF(4)

titulo:	.asciiz "\nComienza programa manejo matrices\n"
dimstr:	.asciiz "\n\nLa matriz tiene dimension "
xstr:	.asciiz "x"
menu:	.ascii "(0) Terminar el programa\n"
	.ascii "(1) Cambiar la matriz de trabajo\n"
	.ascii "(2) Definir matriz 7\n"
	.ascii "(3) Cambiar un valor de la matriz\n"
	.ascii "(7) Contar valores superiores a un umbral\n"
	.asciiz "\nIntroduce opción elegida: "
petmat:	.asciiz "\nElije la matriz de trabajo (1..7): "
errmat:	.asciiz "Numero de matriz de trabajo incorrecto\n"
petnf:	.asciiz "Introduce el numero de filas: "
errnf:	.asciiz "Error: dimension incorrecta.  Numero de filas incorrecto\n"
petnc:	.asciiz "Introduce el numero de columnas: "
errnc:	.asciiz "Error: dimension incorrecta.  Numero de columnas incorrecto\n"
errmax:	.asciiz "Error: dimension incorrecta.  Demasiados elementos\n"
petel:	.asciiz "Introduce el elemento (" 
petcom:	.asciiz ","
petel2:	.asciiz "): "
petfil:	.asciiz "\nIndice de fila: "
errfil:	.asciiz "Error: dimension incorrecta.  Numero de fila incorrecto\n" 
petcol:	.asciiz "Indice de columna: "
errcol:	.asciiz "Error: dimension incorrecta.  Numero de columna incorrecto\n"
petval:	.asciiz "Nuevo valor para el elemento: "
petum:	.asciiz "Introduce el umbral: "
umbstr:	.asciiz "\nNumero de valores superiores al umbral: "
erropc:	.asciiz "Error: opcion incorrecta\n"
finstr:	.asciiz "\nTermina el programa\n"

	.text
main:
	li $v0,4
	la $a0,titulo
	syscall
	
	la $s0,mat1

whiletrue:
	lw $s1,0($s0)		# nFil
	lw $s2,4($s0)		# nCol
	addi $s3,$s0,8		# Puntero base a los datos
	
	la $a0,dimstr
	li $v0,4
	syscall
	move $a0,$s1
	li $v0,1
	syscall
	la $a0,xstr
	li $v0,4
	syscall
	move $a0,$s2
	li $v0,1
	syscall
	li $v0,11
	li $a0,10
	syscall
	
	move $s6,$s3 
	li $s4,0
for1:
	bge $s4,$s1,finfor1
	li $s5,0
for2:
	bge $s5,$s2,finfor2
	l.s $f12,0($s6)
	li $v0,2
	syscall
	li $v0,11
	li $a0,32 
	syscall
	addi $s6,$s6,4		# Avanza 4 bytes (sizeF)
	addi $s5,1
	j for2
finfor2:
	li $v0,11
	li $a0,10
	syscall
	addi $s4,1
	j for1
finfor1:
	li $v0,11
	li $a0,10
	syscall

	li $v0,4
	la $a0,menu
	syscall

	li $v0,5
	syscall

	beqz $v0,whiletruefin
	beq $v0,1,opcion1
	beq $v0,2,opcion2
	beq $v0,3,opcion3
	beq $v0,7,opcion7
	
	li $v0,4
	la $a0,erropc
	syscall
	j whiletrue

# OPCION 1 ///////////////////////////////////
opcion1:
	li $v0,4
	la $a0,petmat
	syscall
	li $v0,5
	syscall
	beq $v0,1,caso1
	beq $v0,2,caso2
	beq $v0,3,caso3
	beq $v0,4,caso4
	beq $v0,5,caso5
	beq $v0,6,caso6
	beq $v0,7,caso7
	
	li $v0,4
	la $a0,errmat
	syscall
	j whiletrue 
caso1: 
	la $s0,mat1
	j whiletrue 
caso2: 
	la $s0,mat2
	j whiletrue 
caso3: 
	la $s0,mat3
	j whiletrue 
caso4: 
	la $s0,mat4
	j whiletrue 
caso5: 
	la $s0,mat5
	j whiletrue 
caso6: 
	la $s0,mat6
	j whiletrue 
caso7: 
	la $s0,mat7
	j whiletrue 

# OPCION 2 ///////////////////////////////////
opcion2:
	li $v0,4
	la $a0,petnf
	syscall
	li $v0,5
	syscall
	blt $v0,1,if_1
	bgt $v0,100,if_1
	j fin_if_1
if_1:
	li $v0,4
	la $a0,errnf
	syscall
	j whiletrue
fin_if_1:
	move $s7,$v0 

	li $v0,4
	la $a0,petnc
	syscall
	li $v0,5
	syscall
	blt $v0,1,if_2
	bgt $v0,100,if_2
	j fin_if_2
if_2:
	li $v0,4
	la $a0,errnc
	syscall
	j whiletrue
fin_if_2:
	move $s8,$v0 
	mul $t0,$s7,$s8

	ble $t0,100,fin_if_3
	li $v0,4
	la $a0,errmax
	syscall
	j whiletrue
fin_if_3:

	la $t0,mat7
	sw $s7,0($t0)
	sw $s8,4($t0)

	addi $s6,$t0,8 
	li $s4,0
for3:
	bge $s4,$s7,finfor3
	li $s5,0
for4:
	bge $s5,$s8,finfor4
	li $v0,4
	la $a0,petel
	syscall
	li $v0,1
	move $a0,$s4
	syscall
	li $v0,4
	la $a0,petcom
	syscall
	li $v0,1
	move $a0,$s5
	syscall
	li $v0,4
	la $a0,petel2
	syscall
	li $v0,6
	syscall
	s.s $f0,0($s6)
	addi $s6,$s6,4
	addi $s5,1
	j for4
finfor4:
	addi $s4,1
	j for3
finfor3:
	j whiletrue

# OPCION 3 ///////////////////////////////////
opcion3:
	li $v0,4
	la $a0,petfil
	syscall
	li $v0,5
	syscall
	bltz $v0,if_4
	bge $v0,$s1,if_4
	j fin_if_4
if_4:
	li $v0,4
	la $a0,errfil
	syscall
	j whiletrue 
fin_if_4:
	move $s4,$v0 

	li $v0,4
	la $a0,petcol
	syscall
	li $v0,5
	syscall
	bltz $v0,if_5
	bge $v0,$s2,if_5
	j fin_if_5
if_5:
	li $v0,4
	la $a0,errcol
	syscall
	j whiletrue 
fin_if_5:
	move $s5,$v0

	li $v0,4
	la $a0,petval
	syscall
	li $v0,6
	syscall

	mul $t0,$s4,$s2
	add $t0,$t0,$s5
	mul $t0,$t0,4
	add $t0,$t0,$s3
	s.s $f0,0($t0)
	j whiletrue

# OPCION 7 ///////////////////////////////////
opcion7:  
	li $v0,4
	la $a0,petum
	syscall
	li $v0,6
	syscall 

	li $s7,0
	move $s6,$s3
	li $s4,0
for5:
	bge $s4,$s1,finfor5
	li $s5,0
for6:
	bge $s5,$s2,finfor6
	l.s $f4,0($s6)
	c.lt.s $f0,$f4
	bc1f fin_if_6
	addi $s7,1
fin_if_6:
	addi $s6,$s6,4  
	addi $s5,1
	j for6
finfor6:
	addi $s4,1
	j for5
finfor5:
	li $v0,4
	la $a0,umbstr
	syscall
	li $v0,1
	move $a0,$s7
	syscall
	j whiletrue

whiletruefin:
	li $v0,4
	la $a0,finstr
	syscall
	li $v0,10
	syscall