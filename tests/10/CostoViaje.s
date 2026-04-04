# // Desarrollar un programa para calcular el costo total de un viaje
# // por carretera y si nuestro presupuesto lo cubre.
# // Se pedirá un entero con los Km del viaje,
# // un entero con los Km por litro de combustible, un float con el precio del
# // litro de combustible y un float con el presupuesto disponible.
# // Se indicarán el costo total del viaje
# // y si supera nuestro presupuesto.
# // Se volverán a pedir los datos hasta que se introduzca unos
# // kilómetros menores o iguales que 0.
#
# #include <iostream>
# #include <iomanip>
#
# int main() {
#   std::cout << std::fixed << std::setprecision(8);  // Ignorar
#   std::cout << "\nCosto viaje";
#
#   while(true) {
#     int Kms;
#     std::cout << "\n\nIntroduce Km del viaje (entero): ";
#     std::cin >> Kms;
#
#     if(Kms <= 0) {
#       break;
#     }
#
#     int KmsPorLitro;
#     std::cout << "Introduce los Km por litro (entero): ";
#     std::cin >> KmsPorLitro;
#
#     float precioLitro;
#     std::cout << "Introduce el precio por litro: ";
#     std::cin >> precioLitro;
#
#     float presupuesto;
#     std::cout << "Introduce el presupuesto: ";
#     std::cin >> presupuesto;
#
#     float costo = ((float)Kms) / KmsPorLitro * precioLitro;
#
#     std::cout << "El recorrido de " << Kms
#         << " Km supone un costo de " << costo;
#
#     if(costo > presupuesto) {
#       std::cout << "\nSupera el presupuesto";
#     }
#   }
#
#   std::cout << "\nTermina el programa\n";
# }

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

# ################# Termina el esqueleto ####################################

	.text
# Asignación variables a registros
# Kms → $s0
# KmsPorLitro → $s1
# precioLitro → $f20
# presupuesto → $f22
# costo → $f24

#int main() {
main:

#  std::cout << std::fixed << std::setprecision(8);  // Ignorar
#  std::cout << "\nCosto viaje\n";
	li	$v0,4
	la	$a0,strTitulo
	syscall

#   while(true) {
while_true:
	# No precisa condición
#  int Kms;
#  std::cout << "Introduce Km del viaje (entero): ";
	li	$v0,4
	la	$a0,strIntroKm
	syscall

#  std::cin >> Kms;
	li	$v0,5
	syscall
	move	$s0,$v0

#     if(Kms <= 0) {
ifKms_0:
	bgtz	$s0,ifKms_0_fin
#       break;
	b	while_true_fin

#     }
ifKms_0_fin:


#  int KmsPorLitro;
#  std::cout << "Introduce los Km por litro (entero): ";
	li	$v0,4
	la	$a0,strIntroLitro
	syscall

#  std::cin >> KmsPorLitro;
	li	$v0,5
	syscall
	move	$s1,$v0

#  float precioLitro;
#  std::cout << "Introduce el precio por litro: ";
	li	$v0,4
	la	$a0,strPrecio
	syscall

#  std::cin >> precioLitro;
	li	$v0,6
	syscall
	mov.s	$f20,$f0

#  float presupuesto;
#  std::cout << "Introduce el presupuesto: ";
	li	$v0,4
	la	$a0,strPresupuesto
	syscall

#  std::cin >> presupuesto;
	li	$v0,6
	syscall
	mov.s	$f22,$f0

#  float costo = ((float)Kms) / KmsPorLitro * precioLitro;
	mtc1	$s0,$f4
	cvt.s.w	$f4,$f4		# $f4 = Kms

	mtc1	$s1,$f6
	cvt.s.w	$f6,$f6		# $f6 = KmsPorLitro

	div.s	$f24,$f4,$f6
	mul.s	$f24,$f24,$f20

#  std::cout << "El recorrido de " << Kms << " Km supone un costo de " << costo;
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

#  if(costo > presupuesto) {
ifCosto:
	c.le.s	$f24,$f22
	bc1t	ifCosto_fin

#    std::cout << "\nSupera el presupuesto";
	li	$v0,4
	la	$a0,strSupera
	syscall


#  }
ifCosto_fin:

	b	while_true
#   }
while_true_fin:

#  std::cout << "\nTermina el programa\n";
	li	$v0,4
	la	$a0,strTermina
	syscall

#}
	li	$v0,10
	syscall
