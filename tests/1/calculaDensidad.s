#// Solución Examen Mayo curso 23-24
#// Calculo de matriz de densidad
#
##include <iostream>
##include <iomanip>
#
#typedef struct {
#  int nFil;
nFil = 0	# El desplazamiento al campo dentro de la estructura
#  int nCol;
nCol = 4	# El desplazamiento al campo dentro de la estructura
#  float elementos[];
elementos = 8	# El desplazamiento al campo dentro de la estructura
#} structMat;
#

sizeF = 4	# Numero de bytes de un float
LF = 10		# Caracter salto de línea
	.data
#structMat mat1 {
#  6,
#  6,
#  {
#    11.11, 12.12, 13.13, 14.14, 15.15, 16.16,
#    21.21, 22.22, 23.23, 24.24, 25.25, 26.26,
#    31.31, 32.32, 33.33, 34.34, 35.35, 36.36,
#    41.41, 42.42, 43.43, 44.44, 45.45, 46.46,
#    51.51, 52.52, 53.53, 54.54, 55.55, 56.56,
#    61.61, 62.62, 63.63, 64.64, 65.65, 66.66
#  }
#};
mat1:	.word	6
	.word	6
	.float	11.11, 12.12, 13.13, 14.14, 15.15, 16.16,
	.float	21.21, 22.22, 23.23, 24.24, 25.25, 26.26,
	.float	31.31, 32.32, 33.33, 34.34, 35.35, 36.36,
	.float	41.41, 42.42, 43.43, 44.44, 45.45, 46.46,
	.float	51.51, 52.52, 53.53, 54.54, 55.55, 56.56,
	.float	61.61, 62.62, 63.63, 64.64, 65.65, 66.66

#structMat mat2 {
#  7,
#  10,
#  {
#    -36.886, -58.201,  78.671,  19.092, -50.781,  33.961, -59.511, 12.347,  57.306,  -1.938,
#    -86.858, -81.852,  54.623, -22.574,  88.217,  64.374,  52.312, 47.918, -83.549,  19.041,
#     4.255, -36.842,  82.526,  27.394,  56.527,  39.448,  18.429, 97.057,  76.933,  14.583,
#    67.79 ,  -9.861, -96.191,  32.369, -18.494, -43.392,  39.857, 80.686, -36.87 , -17.786,
#    30.073,  89.938,  -6.889,  64.601, -85.018,  70.559, -48.853, -62.627, -60.147,  -5.524,
#    84.323, -51.718,  93.127, -10.757,  32.119,  98.214,  69.471, 73.814,   3.724,  57.208,
#    -41.528, -17.458, -64.226, -71.297, -98.745,   7.095, -79.112, 33.819,  63.531, -96.181
#  }
#};
mat2:	.word	7
	.word	10
	.float	-36.886, -58.201,  78.671,  19.092, -50.781,  33.961, -59.511, 12.347,  57.306,  -1.938,
	.float	-86.858, -81.852,  54.623, -22.574,  88.217,  64.374,  52.312, 47.918, -83.549,  19.041,
	.float	4.255, -36.842,  82.526,  27.394,  56.527,  39.448,  18.429, 97.057,  76.933,  14.583,
	.float	67.79 ,  -9.861, -96.191,  32.369, -18.494, -43.392,  39.857, 80.686, -36.87 , -17.786,
	.float	30.073,  89.938,  -6.889,  64.601, -85.018,  70.559, -48.853, -62.627, -60.147,  -5.524,
	.float	84.323, -51.718,  93.127, -10.757,  32.119,  98.214,  69.471, 73.814,   3.724,  57.208,
	.float	-41.528, -17.458, -64.226, -71.297, -98.745,   7.095, -79.112, 33.819,  63.531, -96.181

# structMat mat3 {
#   1,
#   8,
#   {
#     -36.52,  35.3 ,  79.05, -58.69, -55.23, -19.44, -88.63, -93.61
#   }
# };
mat3:	.word	1
	.word	10
	.float	1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0

# structMat mat4 {
#   16,
#   1,
#   { -90.57, -65.11, -58.21, -73.23, -89.38, -79.25,  16.82,  66.3 ,
#     -96.14, -97.16, -24.66,   5.27, -33.5 , -13.09,  27.13, -74.83 }
# };
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


# structMat mat5 {
#   0,
#   0,
#   { 0 }
# };
mat5:	.word	0
	.word	0
	.float	-23.3

# structMat matDensidad {
#   100,
#   10,
#   10
#{
#    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
#    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
#    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
#    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
#    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
#    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
#    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
#    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
#    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
#    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
#  }
# };
matDensidad:	.word	10
	.word	10
	.space	400

# Cadenas de caracteres
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

# void print_mat(structMat* mat) {
#   int nFil = mat->nFil;
#   int nCol = mat->nCol;
#   float* elem = mat->elementos;
#   std::cout << "\nLa matriz tiene dimensión " << nFil << 'x' << nCol << '\n';
#   for(int f = 0; f < nFil; f++) {
#     for(int c = 0; c < nCol; c++) {
#       std::cout << elem[f*nCol + c] << ' ';
#     }
#     std::cout << '\n';
#   }
#   std::cout << '\n';
# }

# float calcDensidadEntorno(float* elemento, int nCol, int n) {

#     float suma = 0.0;
#     for (int i = -n; i <= n; i++) {
#         for (int j = -n; j <= n; j++) {
#             suma += elemento[i * nCol + j];
#         }
#     }
#     return suma / ((2 * n + 1) * (2 * n + 1));
# }

# void calcMatrizDensidad(structMat* src, structMat* dest, int n) {
#     int nFil = src->nFil;
#     int nCol = src->nCol;
#     float* srcElem = src->elementos;

#     dest->nFil = nFil - 2 * n;
#     dest->nCol = nCol - 2 * n;
#     float* destElem = dest->elementos;

#     for (int i = n; i < nFil-n; i++) {
#         for (int j = n; j < nCol-n; j++) {
#             destElem[(i - n) * (nCol - 2 * n) + (j - n)] = calcDensidadEntorno(srcElem + i * nCol + j, nCol, n);
#             //std::cout << destElem[(i - n) * nCol + (j - n)];
#         }
#     }
# }

# // Programa principal
# int main() {
#     std::cout << std::fixed << std::setprecision(8);  // Ignorar
#     std::cout << "\nComienza programa de cálculo de densidad de matriz\n";
#     int option;

#     structMat* matTrabajo = &mat1;
#     int n = 0;

#     do {

#         std::cout <<
#             "\n(1) Seleccionar matriz de trabajo.\n"
#             "(2) Imprimir matriz\n"
#             "(3) Elegir tamaño del entorno\n"
#             "(4) Calcular e imprimir matriz de densidad de la matriz seleccionada.\n"
#             "(5) Imprimir el nombre del autor del programa y la fecha en que fue realizado.\n"
#             "(0) Salir del programa.\n"
#             "\nIntroduce opción elegida: ";
#         std::cin >> option;

#         switch(option) {
#             case 1:
#                 std::cout << "\nSelecciona una matriz (1..5): ";
#                 int matrixNum;
#                 std::cin >> matrixNum;
#                     if (matrixNum == 1) {
#                         matTrabajo = &mat1;
#                         continue;  // volvemos al principio del bucle
#                     }
#                     if (matrixNum == 2) {
#                         matTrabajo = &mat2;
#                         continue;  // volvemos al principio del bucle
#                     }
#                     if (matrixNum == 3) {
#                         matTrabajo = &mat3;
#                         continue;  // volvemos al principio del bucle
#                     }
#                     if (matrixNum == 4) {
#                         matTrabajo = &mat4;
#                         continue;  // volvemos al principio del bucle
#                     }
#                     if (matrixNum == 5) {
#                         matTrabajo = &mat5;
#                         continue;  // volvemos al principio del bucle
#                     }
#                     std::cout << "Numero de matriz de trabajo incorrecto\n";
#                     continue;  // volvemos al principio del bucle

#                 break;
#             case 2:
#                 // Imprimir la matriz seleccionada
#                 print_mat(matTrabajo);
#                 break;
#             case 3:
#                 std::cout << "Introduzca el tamaño de entorno que quiere aplicar: ";
#                 std::cin >> n;
#                 break;
#             case 4:
#                 // Calcular la densidad y luego imprimir la matriz resultante
#                 if ((n <  0) | ((2* n + 1) > matTrabajo->nFil) | ((2* n + 1)> matTrabajo->nCol)) {
#                     std::cout << "Entorno de tamaño no apropiado para la matriz seleccionada.\n";
#                     break;
#                 }
#                 calcMatrizDensidad(matTrabajo, &matDensidad, n);
#                 print_mat(&matDensidad);
#                 break;
#             case 5:
#                 std::cout << "Autor: Tu Nombre\n";
#                 std::cout << "Fecha: Fecha de realización\n";
#                 break;
#             case 0:
#                 std::cout << "Saliendo del programa...\n";
#                 break;
#             default:
#                 std::cout << "Opción inválida\n";
#                 break;
#         }
#     } while (option != 0);

#     return 0;
# }



# ESQUELETO ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑


# #################################################################
#void print_mat(structMat* mat) {
# mat → $a0 → $s0
# nFil → $s1
# nCol → $s2
# f → $s3
# c → $s4
# elem → $s5
print_mat:
# PUSH $s0 a $s5 y $ra ⇒ 7*4 = 28
	addi	$sp,$sp,-28
	sw	$s0,0($sp)
	sw	$s1,4($sp)
	sw	$s2,8($sp)
	sw	$s3,12($sp)
	sw	$s4,16($sp)
	sw	$ra,20($sp)
	sw	$s5,24($sp)

	move	$s0,$a0		# salvamos parámetro de entrada

#  int nFil = mat->nFil;
	lw	$s1,nFil($s0)
#  int nCol = mat->nCol;
	lw	$s2,nCol($s0)
#  float* elem = mat->elementos;
	la	$s5,elementos($s0)
#  std::cout << "\nLa matriz tiene dimension " << nFil << 'x' << nCol << '\n';
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
	li	$a0,LF
	syscall


#  for(int f = 0; f < nFil; f++) {
	move	$s3,$zero
print_mat_for_f:
	bge	$s3,$s1,print_mat_for_f_fin

#    for(int c = 0; c < nCol; c++) {
	move	$s4,$zero
print_mat_for_c:
	bge	$s4,$s2,print_mat_for_c_fin
#      std::cout << elem[f*nCol + c] << ' ';
	mul	$t0,$s3,$s2
	add	$t0,$t0,$s4
	mul	$t0,$t0,sizeF
	add	$t0,$s5,$t0

	l.s	$f12,0($t0)
	li	$v0,2
	syscall

	li	$v0,11
	li	$a0,' '
	syscall

#    }
	addi	$s4,$s4,1
	b 	print_mat_for_c
print_mat_for_c_fin:
#    std::cout << '\n';
	li	$v0,11
	li	$a0,LF
	syscall

#  }
	addi	$s3,$s3,1
	b	print_mat_for_f
print_mat_for_f_fin:

#  std::cout << '\n';
	li	$v0,11
	li	$a0,LF
	syscall

#}
# POP $s0 a $s5 y $ra ⇒ 7*4 = 28
	lw	$s0,0($sp)
	lw	$s1,4($sp)
	lw	$s2,8($sp)
	lw	$s3,12($sp)
	lw	$s4,16($sp)
	lw	$ra,20($sp)
	lw	$s5,24($sp)
	addi	$sp,$sp,28

	jr	$ra

print_mat_fin:

# #################################################################
# Nombre: densidadEntorno
# float calcDensidadEntorno(float* elemento, int nCol, int n)
# Descripción: Función para calcular la 'densidad' del entorno, que es la media
#              de los valores que rodean a uno dado, incluyéndolo
# Argumentos:
#   - elemento: Puntero al elemento del que se quiere calcular la 'densidad' del entorno → $a0
#   - nCol: Número de columnas -> $a1
#   - n: Tamaño del entorno como número de filas/columnas antes y después del elemento a incluir → $a2
# Devuelve:
#   - Valor de 'densidad' del entorno. → $f0
# Registros:
#   - i -> $t1
#   - j -> $t2
#   - Auxiliar -> $t3

calcDensidadEntorno:

    # float suma = 0.0;
    # Inicializar suma y contador
    li.s $f0, 0.0           # suma

    # for (int i = -n; i <= n; i++) {
    # Calcular límites para las filas (i)
    li $t1, -1              # Iniciar i = -n
    mul $t1, $t1, $a2       # i = -n
calcDens_loop_i:
    bgt $t1, $a2, calcDens_end_i     # Si i > n, salir del bucle

    #    for (int j = -n; j <= n; j++) {
    # Calcular límites para las columnas (j)
    li $t2, -1              # Iniciar j = -n
    mul $t2, $t2, $a2       # j = -n
calcDens_loop_j:
    bgt $t2, $a2, calcDens_end_j     # Si j > n, salir del bucle

    #        suma += elemento[i * nCol + j];
    # Calcular desplazamiento actual en la matriz

    mul $t3, $t1, $a1       # i * nCol
    add $t3, $t3, $t2       # + j
    sll $t3, $t3, 2         # * 4 (tamaño de float)
    add $t3, $a0, $t3       # dirección de elemento[i * nCol + j]

    # Sumar el elemento actual al total
    lwc1 $f4, 0($t3)        # cargar float en $f4
    add.s $f0, $f0, $f4     # suma += elemento[i * nCol + j]

    addi $t2, $t2, 1        # j++
    #    }
    j calcDens_loop_j
calcDens_end_j:
    addi $t1, $t1, 1        # i++
    #}

    j calcDens_loop_i
calcDens_end_i:

    # return suma / ((2 * n + 1) * (2 * n + 1));
    # Calcular el divisor: (2 * n + 1) * (2 * n + 1)
	add $t3, $a2, $a2       # 2 * n
    addi $t3, $t3, 1        # 2 * n + 1
    mul $t3, $t3, $t3       # (2 * n + 1) ^ 2
    mtc1 $t3, $f4           # mover a float
    cvt.s.w $f4, $f4        # convertir a float

    # Dividir suma por el divisor
    div.s $f0, $f0, $f4     # suma / divisor

	#}
    jr $ra

calcDensidadEntorno_fin:


# #################################################################
#void calcMatrizDensidad(structMat* src, structMat* dest, int n)
# Parámetros
#   - dirección de structMat *src → $a0
#   - dirección de structMat *dest → $a1
#   - tamaño del entorno n → $a2
# Asignación de variables a registros
#   - src->elementos -> $t0
#   - nFil matDensidad → $t1
#   - nCol matDensidad -> $t2
#   - Auxiliar -> $t3
#   - nFil -> $s0
#   - nCol -> $s1
#   - i -> $s2
#   - j -> $s3
calcMatrizDensidad:

    # Guardar registros que se usarán
    addi $sp, $sp, -20
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    sw $s1, 8($sp)
    sw $s2, 12($sp)
    sw $s3, 16($sp)


    # Cargar nFil y nCol de src
#    int nFil = src->nFil;
    lw $s0, nFil($a0)      # nFil de src
#    int nCol = src->nCol;
    lw $s1, nCol($a0)      # nCol de src
#    float* srcElem = src->elementos;
    la $t0, elementos($a0)      # srcElem, puntero a elementos de src

    # Calcular nuevas dimensiones y establecerlas en dest
#    dest->nFil = nFil - 2 * n;
    sub $t1, $s0, $a2   # nFil - n
    sub $t1, $t1, $a2   # nFil - 2*n
    sw $t1, nFil($a1)      # Set nFil en dest

#    dest->nCol = nCol - 2 * n;
    sub $t2, $s1, $a2   # nCol - n
    sub $t2, $t2, $a2   # nCol - 2*n
    sw $t2, nCol($a1)      # Set nCol en dest

    # Bucles for anidados
#    for (int i = n; i < nFil-n; i++) {
    li $s2, 0           # i = n
calcMat_loop_i:
    bge $s2, $t1, calcMat_end_i # if i >= nFil-n salta a end_i
#        for (int j = n; j < nCol-n; j++) {
    li $s3, 0           # j = n
calcMat_loop_j:
    bge $s3, $t2, calcMat_end_j # if j >= nCol-n salta a end_j

#            destElem[(i - n) * (nCol - 2 * n) + (j - n)] = calcDensidadEntorno(srcElem + i * nCol + j, nCol, n);
    # Calcular índice para srcElem y destElem
	add $t3, $s2, $a2   # i + n
    mul $t3, $t3, $s1   # (i + n) * nCol
    add $t3, $t3, $s3   # + j
	add $t3, $t3, $a2   # + n
	sll $t3, $t3, 2     # * 4 (Tamaño Float)
    add $t3, $t0, $t3   # + srcElem

    # Guardar registros que se usarán
    addi $sp, $sp, -20
    sw $t0, 0($sp)
    sw $t1, 4($sp)
    sw $t2, 8($sp)
	sw $a1, 12($sp)
	sw $a2, 16($sp)
    # Llamar a calcDensidadEntorno
    move $a0, $t3       # *elem
    move $a1, $s1       # nCol
	# move $a2, $a2       # n tamaño del entorno
    jal calcDensidadEntorno
    # Asumir que el resultado de calcDensidadEntorno vuelve en $f0
    lw $t0, 0($sp)
    lw $t1, 4($sp)
    lw $t2, 8($sp)
	lw $a1, 12($sp)
	lw $a2, 16($sp)
    addi $sp, $sp, 20

    # Guardar resultado en destElem
    mul $t3, $s2, $t2   # (i - n) * (nCol - 2*n)
    add $t3, $t3, $s3   # + (j - n)
	sll $t3, $t3, 2     # * 4 (Tamaño Float)
#    float* destElem = dest->elementos;
    la $t4, elementos($a1)      # destElem, puntero a elementos de dest
    add $t4, $t3, $t4   # + destElem
    swc1 $f0, 0($t4)    # Guardar float

    addi $s3, $s3, 1    # j++
    j calcMat_loop_j
calcMat_end_j:
    addi $s2, $s2, 1    # i++
    j calcMat_loop_i
calcMat_end_i:

    # Restaurar registros y retornar
    lw $ra, 0($sp)
    lw $s0, 4($sp)
    lw $s1, 8($sp)
    lw $s2, 12($sp)
    lw $s3, 16($sp)
    addi $sp, $sp, 20
    jr $ra

calcMatrizDensidad_fin:


# #################################################################
#int main() {
# Asignación de variables a registros
# matTrabajo → $s0
# opcion → $s1
# valor → $f20
# valorMin → $f22
# filaMin → $s4
# columnaMin → $s5


main:
#  std::cout << std::fixed << std::setprecision(8);  // Ignorar
#  std::cout << "\nComienza programa manejo matrices con funciones\n";
	li	$v0,4
	la	$a0,str_titulo
	syscall

#  structMat* matTrabajo = &mat1;
	la	$s0,mat1

#  while(true) {
while_true:

#        std::cout << "1) Seleccionar matriz de trabajo.\n";
#        std::cout << "2) Imprimir matriz.\n";
#        std::cout << "3) Elegir tamaño del entorno\n";
#        std::cout << "4) Calcular e imprimir matriz de densidad de la matriz seleccionada.\n";
#        std::cout << "5) Imprimir el nombre del autor del programa y la fecha en que fue realizado.\n";
#        std::cout << "0) Salir del programa.\n";
	li	$v0,4
	la	$a0,str_menu
	syscall

#    int opcion;
#    std::cin >> opcion;
	li	$v0,5
	syscall
	move 	$s1,$v0

#    if(opcion == 0) {
#      break;
#    }
if_opcion0:
	beqz	$s1,while_true_fin

#    // Opción 1 ////////////////////////////////////////////////////////////
#    if(opcion == 1) {
if_opcion1:
	bne	$s1,1,if_opcion1_fin
#      std::cout << "Selecciona una matriz (1-5): ";
	li	$v0,4
	la	$a0,str_elijeMat
	syscall

#       int matrixNum;
#       std::cin >> matrixNum;
    li	$v0,5
	syscall

#      if (matrixNum == 1) {
if_MatT1:
	bne	$v0,1,if_MatT1_fin
#        matTrabajo = &mat1;
	la	$s0,mat1
#        continue;  // volvemos al principio del bucle
	b	while_true
#      }
if_MatT1_fin:

#      if (matrixNum == 2) {
if_MatT2:
	bne	$v0,2,if_MatT2_fin
#        matTrabajo = &mat2;
	la	$s0,mat2
#        continue;  // volvemos al principio del bucle
	b	while_true
#      }
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

#      std::cout << "Numero de matriz de trabajo incorrecto\n";
	li	$v0,4
	la	$a0,str_numMatMal
	syscall

#      continue;  // volvemos al principio del bucle
	b	while_true
#    }
if_opcion1_fin:
#    // Opción 2 ////////////////////////////////////////////////////////////
#           case 2:
if_opcion2:
	bne	$s1,2,if_opcion2_fin
#                // Imprimir la matriz seleccionada
#                print_mat(matTrabajo);
	move	$a0,$s0
	jal	print_mat
#                break;
	b while_true
if_opcion2_fin:

#    // Opción 3 ////////////////////////////////////////////////////////////
#            case 3:
if_opcion3:
	bne	$s1,3,if_opcion3_fin
#                std::cout << "Introduzca el tamaño del entorno que quiere aplicar: ";
    li $v0, 4
    la $a0, str_entorno
    syscall

#                std::cin >> n;
    li $v0, 5            # Leer un entero desde consola
    syscall
    move $s2, $v0        # Guarda el valor de n en $s2 para uso futuro
#                break;
	b while_true
if_opcion3_fin:

#    // Opción 4 ////////////////////////////////////////////////////////////
#            case 4:
if_opcion4:
	bne	$s1,4,if_opcion4_fin
#                // Calcular la densidad y luego imprimir la matriz resultante
#                if ((n <  0) | ((2* n + 1) {
	bltz $s2, error_entorno
	add $t1, $s2, $s2
	addi $t1, $t1, 1   # (2 * n + 1)
	lw $t2, nFil($s0)
	bgt $t1, $t2, error_entorno
	lw $t2, nCol($s0)
	ble $t1, $t2, end_error_entorno
error_entorno:
#                    std::cout << "Entorno de tamaño no apropiado para la matriz seleccionada\n";
	li $v0, 4
	la $a0, str_errorEnt
	syscall
#                    break;
	b while_true
#                }
end_error_entorno:
#                calcMatrizDensidad(matTrabajo, &matDensidad, n);
	move $a0, $s0
	la $a1, matDensidad
	move $a2, $s2
	jal calcMatrizDensidad
#                print_mat(&matDensidad);
	la $a0, matDensidad
	jal print_mat

#                break;
	b while_true
if_opcion4_fin:

#    // Opción 5 ////////////////////////////////////////////////////////////
#            case 5:
if_opcion5:
	bne	$s1,5,if_opcion5_fin
#                std::cout << "Autor: Tu Nombre\n";
	li $v0, 4
	la $a0, str_autor
#                std::cout << "Fecha: Fecha de realización\n";
	li $v0, 4
	la $a0, str_fecha
#                break;
	b while_true
if_opcion5_fin:

#    // Opción Incorrecta ///////////////////////////////////////////////////////
#    std::cout << "Opción Inválida\n";
	li	$v0,4
	la	$a0,str_errorOpc
	syscall

#  }
	b	while_true
while_true_fin:

#  std::cout << "\nTermina el programa\n";
	li	$v0,4
	la	$a0,str_termina
	syscall

#}
	li		$v0,10
	syscall
