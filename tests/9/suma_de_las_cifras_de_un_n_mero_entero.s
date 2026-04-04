# practica 2. Principio de computadoras

	.data		
titulo: 	.asciiz	"\nSuma las cifras de un número entero. Introduzca un 0 para salir del programa.\n "
msgnumero:	.asciiz	"\n\nIntroduzca un entero para calcular la suma de sus cifras (0 para salir): "
msgresultado1:	.asciiz	"\nLa suma de las cifras es  "
msgfin:			.asciiz "\nFIN DEL PROGRAMA.\n"

	.text		
main:
	# Registro de variables:
	# $t0: numero
	# $s3: suma
	# $t1: constante 10 (divisor)
	# $t2: cifra (residuo)

	# std::cout << "Suma las cifras de un número entero..." << std::endl;
	la	$a0,titulo
	li	$v0,4
	syscall

etiqueta_do:
	# std::cout << "Introduzca un entero..."
	li $v0,4
	la $a0,msgnumero
	syscall
	
	# std::cin >> numero;
	li $v0,5
	syscall
	move $t0,$v0   
	
	# if (numero == 0) break;
	beqz $t0,fin

	# if (numero < 0 ) numero = 0 - numero; 
	bgez $t0,positivo
	sub $t0,$zero,$t0
positivo:

	# suma = 0;
	li $s3,0  
	li $t1,10 # Divisor fijo para extraer cifras

while: 
	# while ( numero != 0 )
	beqz $t0,finwhile
	
	# cifra = numero % 10; numero /= 10;
	div $t0,$t1
	mflo $t0       # Cociente (actualiza numero)
	mfhi $t2       # Residuo (cifra extraída)
	
	# suma += cifra;
	add $s3,$s3,$t2
	j while
	
finwhile:
	# std::cout << "La suma de las cifras es " << suma << std::endl;	
	li $v0,4
	la $a0,msgresultado1
	syscall
	
	li $v0,1
	move $a0,$s3
	syscall

	j etiqueta_do

fin:
	# Finalización del programa
	li $v0,4
	la $a0,msgfin
	syscall
	
	li $v0,10
	syscall