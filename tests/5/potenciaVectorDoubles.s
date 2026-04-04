# // Solución C++ para potencia vector doubles
# // Autor: Alberto Hamilton
# // 2025-04-28

# #include <iostream>
# #include <iomanip>

# const int v1Largo = 10;
# double v1[v1Largo] = {-3.125,  8.875,  7.6875, -0.71875, -5.25, -3.875,
#   -3.3125, -0.375,  0.140625, 0.96875};

# const int v2Largo = 6;
# double v2[v2Largo] = {-1.03125,  5.640625,  2.953125, -1.625, -2.90625, -0.25};

# const int v3Largo = 0;
# double v3[] = { -65535.0 };

# double eleva(double x, int n) {
#   double pot = 1.0;
#   for(int i = 1; i <= n; i++) {
#     pot = pot * x;
#   }
#   return pot;
# }

# double potencia_vect(double* v, int largo, int expo) {
#   double acumulado = 0.0;
#   for(int i = 0; i < largo; i++) {
#     double valor = v[i];
#     double elevado = eleva(valor, expo);
#     v[i] = elevado;
#     acumulado += elevado;
#   }
#   return acumulado;
# }

# void printvec(double *v, const int n) {
#     for (int i = 0; i < n; i++)
#         std::cout << v[i] << " ";

#     std::cout << "\n";
#     return;
# }

# int main() {
#   std::cout << std::setprecision(18);  // ignorar

#   std::cout << "\nPotencia Vectores Doubles\n";

#   while(true) {
#     std::cout << "\nElige vector 1, 2, 3 o 0 para terminar: ";
#     int opcion;
#     std::cin >> opcion;
#     if (opcion == 0) {
#       break;
#     }
#     if ((opcion < 0) || (opcion > 3)) {
#       std::cout << "Opción incorrecta";
#       continue;
#     }
#     double* vTrabajo = v1;
#     int largoTrabajo = v1Largo;
#     if (opcion == 2) {
#       vTrabajo = v2;
#       largoTrabajo = v2Largo;
#     }
#     if (opcion == 3) {
#       vTrabajo = v3;
#       largoTrabajo = v3Largo;
#     }
#     std::cout << "Introduce exponente: ";
#     int n;
#     std::cin >> n;

#     printvec(vTrabajo, largoTrabajo);
#     double suma = potencia_vect(vTrabajo, largoTrabajo, n);
#     std::cout << "\nLa suma es " << suma << '\n';
#     printvec(vTrabajo, largoTrabajo);

#   }
#   std::cout << "\nTermina el programa\n";
# }
	.data
sizeD = 8

v1Largo:	.word 10
v1:		.double	-3.125,  8.875,  7.6875, -0.71875, -5.25, -3.875
		.double	-3.3125, -0.375,  0.140625, 0.96875

v2Largo:	.word 6
v2:		.double -1.03125,  5.640625,  2.953125, -1.625, -2.90625, -0.25

v3Largo:	.word	0
v3:		.double -65535.0

# Cadenas del programa principal
str_titulo:	.asciiz	"\nPotencia Vectores Doubles\n"
str_elige:	.asciiz	"\nElige vector 1, 2, 3 o 0 para terminar: "
str_incorrecta:	.asciiz	"Opción incorrecta"
str_introexpo:	.asciiz	"Introduce exponente: "
str_lasumaes:	.asciiz	"\nLa suma es "
str_termina:	.asciiz	"\nTermina el programa\n"

	.text
# #######################################################################
# double eleva(double x, int n) {
# x → f12
# n → a0
# parametro de salida double → f0 (pot)
# pot → f0
# i → t0
eleva:
#   double pot = 1.0;
	li.d	$f0,1.0
#   for(int i = 1; i <= n; i++) {
	li	$t0,1
eleva_for:
	bgt	$t0,$a0,eleva_for_fin
#     pot = pot * x;
	mul.d	$f0,$f0,$f12

#   }
	addi	$t0,1
	b	eleva_for
eleva_for_fin:
#   return pot; pot ya está en $f0
# }
	jr	$ra
eleva_fin:

# #######################################################################
# double potencia_vect(double* v, int largo, int expo) {
# v → a0 → s0
# largo → a1 → s1
# expo → a2 → s2
# parametro de salida double → f0 (acumulado)
# acumulado → f20
# i → s3
# valor → f12
# elevado → f0
potencia_vect:
	# PUSH ra, s0, s1, s2, f20, s3: 5 * 4 + 8 = 28
	addi	$sp,-28
	sw	$ra,0($sp)
	sw	$s0,4($sp)
	sw	$s1,8($sp)
	sw	$s2,12($sp)
	s.d	$f20,16($sp)
	sw	$s3,24($sp)

	# salvamos los parámetros de entrada
	move	$s0,$a0
	move	$s1,$a1
	move	$s2,$a2

#   double acumulado = 0.0;
	li.d 	$f20,0.0
#   for(int i = 0; i < largo; i++) {
	move	$s3,$zero
potencia_vect_for:
	bge	$s3,$s1,potencia_vect_for_fin

#     double valor = v[i];
	mul	$t0,$s3,sizeD
	addu	$t0,$t0,$s0
	l.d	$f12,0($t0)

#     double elevado = eleva(valor, expo);
	# valor ya en f12
	move	$a0,$s2
	jal	eleva
	# resultado en $f0 lo guardamos en la misma dircción
#     v[i] = elevado;
	mul	$t0,$s3,sizeD
	addu	$t0,$t0,$s0
	s.d 	$f0,0($t0)

#     acumulado += elevado;
	add.d 	$f20,$f20,$f0

#   }
	addi	$s3,1
	b	potencia_vect_for
potencia_vect_for_fin:
#   return acumulado;
	mov.d	$f0,$f20

# }
	# POP
	lw	$ra,0($sp)
	lw	$s0,4($sp)
	lw	$s1,8($sp)
	lw	$s2,12($sp)
	l.d	$f20,16($sp)
	lw	$s3,24($sp)
	addi	$sp,28

	jr	$ra
potencia_vect_fin:
# #######################################################################

# ################################################################
# void printvec(double *v, const int n) {
# double *v → $a0
# int n → $a1
printvec:
	# Código OFUSCADO
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
# ################################################################
# int main() {
# opcion → s0
# vTrabajo → s1
# largoTrabajo → s2
# n → s3
# suma → f20
main:
	#   std::cout << std::setprecision(18);  // ignorar
	#   std::cout << "\nPotencia Vectores Doubles\n";
	li	$v0,4
	la	$a0,str_titulo
	syscall

	#   while(true) {
while_true:
	#     std::cout << "\nElige vector 1, 2, 3 o 0 para terminar: ";
	li	$v0,4
	la	$a0,str_elige
	syscall

	#     int opcion;
	#     std::cin >> opcion;
	li	$v0,5
	syscall
	move	$s0,$v0
	#     if (opcion == 0) {
	#       break;
	#     }
	beqz	$s0,while_true_fin

	#     if ((opcion < 0) || (opcion > 3)) {
if_opcionValida:
	bltz	$s0,if_opcionValida_then
	ble	$s0,3,if_opcionValida_fin
if_opcionValida_then:
	#       std::cout << "Opción incorrecta";
	li	$v0,4
	la	$a0,str_incorrecta
	syscall

	#       continue;
	b	while_true
	#     }
if_opcionValida_fin:
	#     double* vTrabajo = v1;
	la	$s1,v1
	#     int largoTrabajo = v1Largo;
	lw	$s2,v1Largo
	#     if (opcion == 2) {
if_opcion2:
	bne	$s0,2,if_opcion2_fin
	#       vTrabajo = v2;
	la	$s1,v2
	#       largoTrabajo = v2Largo;
	lw	$s2,v2Largo
	#     }
if_opcion2_fin:

	#     if (opcion == 3) {
if_opcion3:
	bne	$s0,3,if_opcion3_fin
	#       vTrabajo = v3;
	la	$s1,v3
	#       largoTrabajo = v3Largo;
	lw	$s2,v3Largo
	#     }
if_opcion3_fin:

#     std::cout << "Introduce exponente: ";
	li	$v0,4
	la	$a0,str_introexpo
	syscall
#     int n;
#     std::cin >> n;
	li	$v0,5
	syscall
	move	$s3,$v0

#     printvec(vTrabajo, largoTrabajo);
	move	$a0,$s1
	move	$a1,$s2
	jal	printvec

#     double suma = potencia_vect(vTrabajo, largoTrabajo, n);
	move	$a0,$s1
	move	$a1,$s2
	move 	$a2,$s3
	jal	potencia_vect
	mov.d	$f20,$f0

#     std::cout << "\nLa suma es " << suma;
	li	$v0,4
	la	$a0,str_lasumaes
	syscall

	li	$v0,3
	mov.d	$f12,$f20
	syscall

	li	$v0,11
	li	$a0,'\n'
	syscall

#     printvec(vTrabajo, largoTrabajo);
	move	$a0,$s1
	move	$a1,$s2
	jal	printvec

#   }
	b	while_true
while_true_fin:
#   std::cout << "\nTermina el programa";
	li	$v0,4
	la	$a0,str_termina
	syscall
# }

	li	$v0,10
	syscall
