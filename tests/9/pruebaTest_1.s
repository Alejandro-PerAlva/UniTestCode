# practica 2. Principio de computadoras
# OBJETIVO: introduce el codigo necesario para reproducir el comportamiento del programa
# C++ que se adjunta como comentarios
# Debes documentar debidamente el uso de los registros que has elegido y la correspondencia
# con las variables que has utilizado.

##include <iostream>
# int main()
# {
#     std::cout << "Suma las cifras de un número entero." << std::endl;
#     std::cout << "Introduzca un 0 para salir del programa." << std::endl;


#     int numero,cifra,suma;
#     do {
#         std::cout << "Introduzca un entero para calcular la suma de sus cifras (0 para salir): ";
#         std::cin >> numero;
#		  if (numero == 0) break;
#         if (numero < 0 ) numero = 0 - numero; 
#         suma = 0;
#         while ( numero != 0 ){
#             cifra = numero % 10;
#             suma += cifra;
#             numero /= 10;
#         }
#         std::cout << "La suma de las cifras es " << suma << std::endl;
#     } while (true);
#     std::cout << "FIN DEL PROGRAMA. " << std::endl;
#     return 0;
# }

	.data		# directiva que indica la zona de datos
titulo: 	.asciiz	"\nSuma las cifras de un número entero. Introduzca un 0 para salir del programa.\n "
msgnumero:	.asciiz	"\n\nIntroduzca un entero para calcular la suma de sus cifras (0 para salir): "

msgresultado1:	.asciiz	"\nLa suma de las cifras es  "
msgfin:			.asciiz "\nFIN DEL PROGRAMA.\n"


	.text		# directiva que indica la zona de código
main:
	# IMPRIME EL TITULO POR CONSOLA
	# std::cout << "Suma las cifras de un número entero." << std::endl;
	# std::cout << "Introduzca un 0 para salir del programa." << std::endl;
 
	la	$a0,titulo
	li	$v0,4
	syscall


	# EL MAYOR PORCENTAJE DEL CÓDIGO C++ SE ENCUENTRA DENTRO DE UNA ESTRUCTURA do { ...  } while (true).
	# IMPLEMENTA EN MIPS ESE BUCLE INFINITO, Y A CONTINUACIÓN DESARROLLA CADA UNA DE LAS SECCIONES QUE 
	# SE ENCUENTRAN EN SU INTERIOR.

	etiqueta_do:
	# INTRODUCE EN ESTA SECCION EL CÓDIGO MIPS EQUIVALENTE AL SIGUIENTE FRAGMENTO C++
	# TEN EN CUENTA QUE break NO ES SINO UN SALTO A LA SIGUIENTE INSTRUCCION QUE ESTE FUERA DEL BUCLE
	# do { ...  } while (true).
	#         std::cout << "Introduzca un entero para calcular la suma de sus cifras (0 para salir): ";
	#         std::cin >> numero;
	#		  if (numero == 0) break;

		li $v0,4
		la $a0,msgnumero
		syscall
		li $v0,5
		syscall
		move $t0,$v0   # $t0 numero
		beqz $t0,fin

	# INTRODUCE EN ESTA SECCION EL CODIGO MIPS EQUIVALENTE AL SIGUIENTE FRAGMENTO C++
	#         if (numero < 0 ) numero = 0 - numero;
		bgez $t0,positivo
		sub $t0,$zero,$t0
		positivo:

	# INTRODUCE EN ESTA SECCION EL CODIGO MIPS EQUIVALENTE AL SIGUIENTE FRAGMENTO C++
	#         suma = 0;
	#         while ( numero != 0 ){
	#             cifra = numero % 10;
	#             suma += cifra;
	#             numero /= 10;
	#         }

		li $s3,0  # $s3 es suma
		li $t1,10 # $t1 es la constante diez por la que dividimos
		while: beqz $t0,finwhile
			div $t0,$t1
			mflo $t0
			mfhi $t2 # $t2 es cifra
			add $s3,$s3,$t2
			j while
		finwhile:
	# INTRODUCE EN ESTA SECCION EL CODIGO MIPS EQUIVALENTE AL SIGUIENTE FRAGMENTO C++
	#         std::cout << "La suma de las cifras es " << suma << std::endl;	
		li $v0,4
		la $a0,msgresultado1
		syscall
		li $v0,1
		move $a0,$s3
		syscall

	j etiqueta_do
	fin:
	# las siguientes instrucciones  imprimen la cadena de fin y finalizan el programa
	li $v0,4
	la $a0,msgfin
	syscall
	li $v0,10
	syscall
 
