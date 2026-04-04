# comprueba reparte_columna

# ##########################################################################
# Definición segmento .data
	.data

# typedef struct {
#   int nFil;
#   int nCol;
#   double elementos[];
# } structMat;


mat1:	.word	6
	.word	6

	.double	61.5625, 62.5625, 63.625, 64.625, 65.625, -66.625,
	.double	11.0625, 12.0625, 13.125, 14.125, 15.125, 16.125,
	.double	31.25, 32.3125, 33.3125, 34.3125, 35.3125, 36.3125,
	.double	21.1875, 22.1875, 23.1875, 24.1875, 25.25, 26.25,
	.double	41.375, 42.375, 43.375, 44.4375, 45.4375, 46.4375,
	.double	51.5, 52.5, 53.5, 43.375, 55.5, 56.5,

mat2:	.word	8
	.word	5
	.double	94.75, -82.75, -79.8125, 89.9375, 33.75,
	.double	94.75, -93.375, -21.125, 35.875, -23.5,
	.double	93.75, -15.0,-10.6875, -68.8125, 17.125,
	.double	-24.1875, -40.125, 68.9375, -68.8125, -5.5625,
	.double	-78.1875, -70.25, 1.28125, 30.375, -26.0,
	.double	-89.5, 80.6875, 25.4375, 66.5, 76.4375,
	.double	-24.0, -58.0, -52.25, 97.875, 84.0625,
	.double	-80.875, 72.375, -93.0625, 98.5625, 43.3125,

mat3:	.word	1
	.word	6
	.double	-76.75, -20.5625, 4.09375, 43.25, -20.3125, 1.125,

mat4:	.word	14
	.word	1
	.double	-79.5625, -84.4375, -86.25, 13.6875, -94.5, -15.1875, 47.9375,
	.double	-22.75, -6.53125, 8.84375, -20.125, -21.25, 1.9375, -25.25,

mat5:	.word	1
	.word	1
	.double	67.75

mat6:	.word	0
	.word	0
	.word	0x7FF0000000000000

# Cadenas de caracteres
str_matTiene:	.asciiz	"\n\nLa matriz tiene dimension "
str_comienza:	.asciiz	"\nComienza programa organiza columnas cota\n"
str_menu:	.ascii	"\n\n"
		.ascii	"(1) Cambiar la matriz de trabajo\n"
		.ascii	"(4) Reparte Columna\n"
		.ascii	"(9) Terminar el programa\n"
		.asciiz	"\nIntroduce opción elegida: "
str_elije:	.asciiz	"\nElije la matriz de trabajo (1..6): "
str_indColIni:	.asciiz	"\nIndice de columna: "
str_indColFin:	.asciiz	"Indice de columna final: "
str_numCambios:	.asciiz	"Numero de cambios: "
str_factorOrga:	.asciiz	"Factor organización = "
str_errorOpc:	.asciiz	"Error: opcion incorrecta\n"
str_termina:	.asciiz	"\nTermina el programa\n"

	.text

# # ########################################################################

print_matriz:
	.word	0x23bdffd8, 0xafbf0000, 0xafb00004, 0xafb10008
	.word	0xafb2000c, 0xafb30010, 0xafb40014, 0xf7b40018
	.word	0xf7b60020, 0x34010000, 0x4481a000, 0x34010000
	.word	0x4481a800, 0x8c900000, 0x8c910004, 0x20920008
	.word	0x34020004, 0x3c011001, 0x3424033c, 0x0000000c
	.word	0x34020001, 0x00102021, 0x0000000c, 0x3402000b
	.word	0x34040078, 0x0000000c, 0x34020001, 0x00112021
	.word	0x0000000c, 0x3402000b, 0x3404000a, 0x0000000c
	.word	0x34130000, 0x0270082a, 0x10200017, 0x34140000
	.word	0x0291082a, 0x1020000f, 0x72714002, 0x01144020
	.word	0x34010008, 0x71014002, 0x02484020, 0xd5160000
	.word	0x34020003, 0x4620b306, 0x0000000c, 0x3402000b
	.word	0x34040020, 0x0000000c, 0x22940001, 0x0401fff1
	.word	0x3402000b, 0x3404000a, 0x0000000c, 0x22730001
	.word	0x0401ffe9, 0x3402000b, 0x3404000a, 0x0000000c
	.word	0x8fbf0000, 0x8fb00004, 0x8fb10008, 0x8fb2000c
	.word	0x8fb30010, 0x8fb40014, 0xd7b40018, 0xd7b60020
	.word	0x23bd0028, 0x03e00008,
print_matriz__MARCAFIN:


# ########################################################
# int reparte_columna(structMat* mat, int indCol) {
# Parámetros de entrada:
# structMat* mat → a0
# int indCol → a1
# Parametro de salida: int → v0
# NO llama a otra función ⇒ NO NECESITA PILA
# Variables locales
# int numCambios → t0
# int numF → t1
# int numC → t3
# double* elem → t4
# int f → t5
# double elem1 → f4
# double elem2 → f6

reparte_columna:

	#   int numCambios = 0;
	move	$t0,$zero
	#   int numF = mat->nFil;
	lw	$t1,0($a0)
	#   int numC = mat->nCol;
	lw	$t3,4($a0)
	#   double* elem = mat->elementos;
	la	$t4,8($a0)

	#   for(int f = 0; f < (numF -1); f++) {
	move	$t5,$zero
reparte_columna_forF:
	addi	$t6,$t1,-1
	bge	$t5,$t6,reparte_columna_forF_fin

	#     double elem1 = elem[f * numC + indCol];
	mul	$t7,$t5,$t3
	add	$t7,$t7,$a1
	mul	$t7,$t7,8
	add	$t7,$t4,$t7	#t7 dirección elem1

	l.d	$f4,0($t7)

	#     double elem2 = elem[(f + 1) * numC + indCol];
	addi	$t8,$t5,1
	mul	$t8,$t8,$t3
	add	$t8,$t8,$a1
	mul	$t8,$t8,8
	add	$t8,$t4,$t8	# t8 dirección de elem2

	l.d	$f6,0($t8)

	#     if (elem1 > elem2) {
reparte_columna_if_elem12:
	c.le.d	$f4,$f6
	bc1t	reparte_columna_if_elem12_else

	#       elem[f * numC + indCol] = elem2;
	s.d	$f6,0($t7)
	#       elem[(f + 1) * numC + indCol] = elem1;
	s.d	$f4,0($t8)
	#       numCambios++;
	addi	$t0,1

	#     } else {
	b	reparte_columna_if_elem12_fin
reparte_columna_if_elem12_else:
	#       elem[f * numC + indCol] = -elem1;
	neg.d	$f4,$f4
	s.d	$f4,0($t7)

	#     }
reparte_columna_if_elem12_fin:

	#   }
	addi	$t5,1
	b	reparte_columna_forF
reparte_columna_forF_fin:
	#   return numCambios;
	move	$v0,$t0
	# }
	jr	$ra
reparte_columna__MARCAFIN:
# ########################################################
# Para poner justo debajo de la rutina a probar
# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	.data
strSigueDebajo:	.asciiz	"\n*** Rutina no regresa adecuadamente. ***"
	.text
	la	$a0,strSigueDebajo
	li	$v0,4
	syscall

	li	$v0,10
	syscall
# ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


# ########################################################
# int main() {
# Varibles locales
# structMat* matTrabajo → $s0
# int opcion → s1
# int matT → v0
# int indColIni → s2
# int indColFin → s3
# double cota → f20
# double factor → f22

main:
	#   std::cout << std::setprecision(18);  // ignorar
	#   std::cout << "\nComienza programa organiza columnas cota\n";
	li	$v0,4
	la	$a0,str_comienza
	syscall

	#   structMat* matTrabajo = &mat1;
	la	$s0,mat1
	#   while(true) {
while_true:
	#     print_matriz(matTrabajo);
	move	$a0,$s0
	jal	print_matriz

	#     std::cout << "\n\n"
	#     "(1) Cambiar la matriz de trabajo\n"
	#     "(4) Organizar columnas cota\n"
	#     "(9) Terminar el programa\n"
	#     "\nIntroduce opción elegida: ";
	li	$v0,4
	la	$a0,str_menu
	syscall

	#     int opcion;
	#     std::cin >> opcion;
	li	$v0,5
	syscall
	move	$s1,$v0

	#     if(opcion == 9) {
	#       break;
	#     }
	beq	$s1,9,while_true_fin

	#     // Opción 1 ///////////////////////////////////////////
	#     if(opcion == 1) {
if_opcion_1:
	bne	$s1,1,if_opcion_1_fin
	#       std::cout << "\nElije la matriz de trabajo (1..6): ";
	li	$v0,4
	la	$a0,str_elije
	syscall
	#       int matT;
	#       std::cin >> matT;
	li	$v0,5
	syscall
	# v0 se queda matT
switch_matT:
	#       switch(matT) {
	beq	$v0,1,switch_matT_1
	beq	$v0,2,switch_matT_2
	beq	$v0,3,switch_matT_3
	beq	$v0,4,switch_matT_4
	beq	$v0,5,switch_matT_5
	beq	$v0,6,switch_matT_6
	b	switch_matT_default
	#         case 1:
switch_matT_1:
	#           matTrabajo = &mat1;
	la	$s0,mat1
	#           break;
	b	switch_matT_fin
	#         case 2:
switch_matT_2:
	#           matTrabajo = &mat2;
	la	$s0,mat2
	#           break;
	b	switch_matT_fin
	#         case 3:
switch_matT_3:
	#           matTrabajo = &mat3;
	la	$s0,mat3
	#           break;
	b	switch_matT_fin
	#         case 4:
switch_matT_4:
	#           matTrabajo = &mat4;
	la	$s0,mat4
	#           break;
	b	switch_matT_fin
	#         case 5:
switch_matT_5:
	#           matTrabajo = &mat5;
	la	$s0,mat5
	#           break;
	b	switch_matT_fin
	#         case 6:
switch_matT_6:
	#           matTrabajo = &mat6;
	la	$s0,mat6
	#           break;
	b	switch_matT_fin
	#         default:
switch_matT_default:
	#           matTrabajo = &mat1;
	la	$s0,mat1

	#       }
switch_matT_fin:
	#       continue;
	b	while_true
	#     }
if_opcion_1_fin:

	#     // Opción 4 /////////////////////////////////////////
	#     if(opcion == 4) {
if_opcion_4:
	bne	$s1,4,if_opcion_4_fin
	#       std::cout << "\nIndice de columna inicial: ";
	li	$v0,4
	la	$a0,str_indColIni
	syscall
	#       int indColIni;
	#       std::cin >> indColIni;
	li	$v0,5
	syscall
	move	$s2,$v0

	#       int cambios = reparte_columna(matTrabajo, indColIni)
	move	$a0,$s0
	move	$a1,$s2
# +++++++++++++++++++++++++++++++++++++++++
# Para poner en Main para la invocación de la función donde está el JAL
	jal	iniciaSalvados
#	Invocar a la función a probar
	jal	reparte_columna
	jal	compruebaSalvados
	move	$s8,$v0

	#       std::cout << "Factor organización = " << factor;
	li	$v0,4
	la	$a0,str_numCambios
	syscall

	li	$v0,1
	move	$a0,$s8
	syscall

	#      continue;  // volvemos al principio del bucle
		b	while_true
	#     }
if_opcion_4_fin:

	#     // Opción Incorrecta //////////////////////////////////
	#     std::cout << "Error: opcion incorrecta\n";
	li	$v0,4
	la	$a0,str_errorOpc
	syscall
	#   }
	b	while_true
while_true_fin:
	#   std::cout << "\nTermina el programa\n";
	li	$v0,4
	la	$a0,str_termina
	syscall
	# }
	li	$v0,10
	syscall

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

__GuardaS0:	.word	0
__GuardaS1:	.word	0
__GuardaS2:	.word	0
__GuardaS3:	.word	0
__GuardaS4:	.word	0
__GuardaS5:	.word	0
__GuardaS6:	.word	0
__GuardaS7:	.word	0
__GuardaS8:	.word	0
	.text

# valIniD = 111.11 no se puede definir con punto
# incD = 3.33 no se puede definir con punto

# #########################################################
iniciaSalvados:
	# Guardamos valor inicial de salvados
	sw	$s0,__GuardaS0
	sw	$s1,__GuardaS1
	sw	$s2,__GuardaS2
	sw	$s3,__GuardaS3
	sw	$s4,__GuardaS4
	sw	$s5,__GuardaS5
	sw	$s6,__GuardaS6
	sw	$s7,__GuardaS7
	sw	$s8,__GuardaS8

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

strSPModif:	.asciiz	"\n*** Pila no equilibrada ***"
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

	# Recuperamos valor inicial de salvados
	lw	$s0,__GuardaS0
	lw	$s1,__GuardaS1
	lw	$s2,__GuardaS2
	lw	$s3,__GuardaS3
	lw	$s4,__GuardaS4
	lw	$s5,__GuardaS5
	lw	$s6,__GuardaS6
	lw	$s7,__GuardaS7
	lw	$s8,__GuardaS8


	# Recuperamos todo lo que puede ser parámetro salida función
	lw	$v0,valorV0
	lw	$v1,valorV1
	l.d	$f0,valorF0
	l.d	$f2,valorF2
	lw	$a0,valorA0
	lw	$ra,valorRA	# guarda $ra sin usar pila
	jr	$ra

## Funciones auxiliares de comprobación ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^