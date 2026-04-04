#// Programa para evaluar polinomio tercer grado

# #include <iostream>
# #include <iomanip>

# int main(void) {
#   std::cout << std::fixed << std::setprecision(8);  // Ignorar
#   float a,b,c,d;
#   std::cout << "\nEvaluacion polinomio f(x) = a x^3 + b x^2 + c x + d"
#             << " en un intervalo [r,s]\n";
#   std::cout << "\nIntroduzca coeficiente a: ";
#   std::cin >> a;
#   std::cout << "Introduzca coeficiente b: ";
#   std::cin >> b;
#   std::cout << "Introduzca coeficiente c: ";
#   std::cin >> c;
#   std::cout << "Introduzca coeficiente d: ";
#   std::cin >> d;
#   int r,s;
#   do {
#     std::cout << "\nLímite inferior r: ";
#     std::cin >> r;
#     std::cout << "Límite superior s: ";
#     std::cin >> s;
#   } while (r > s);

#   for (int x = r ; x <= s ; x++) {
#     // float f = x*x*x*a + x*x*b + x*c + d;
#     float f = d;
#     f += x*c;
#     f += x*x*b;
#     f += x*x*x*a;
#     if (f >= 2.5) {
#       std::cout << "\nf(" << x << ") = " << f;
#     }
#   }
#   std::cout << "\n\nTermina el programa\n";
# }

	.data
strTitulo:	.ascii	"\nEvaluacion polinomio f(x) = a x^3 + b x^2 + c x + d"
		.asciiz	" en un intervalo [r,s]\n"
strIntroA:	.asciiz	"\nIntroduzca coeficiente a: "
strIntroB:	.asciiz	"Introduzca coeficiente b: "
strIntroC:	.asciiz	"Introduzca coeficiente c: "
strIntroD:	.asciiz	"Introduzca ciciente d: "

strIntroR:	.asciiz	"\nLímite inferior r: "
strIntroS:	.asciiz	"Límite superior s: "

strF:		.asciiz	"\nf("
strIgual:	.asciiz	") = "
strTermina:	.asciiz	"\n\nTermina el programa\n"

## Hasta aquí el esqueleto #################################################
# ##########################################################################

	.text
# Asgnación de variables a registros
# a -> $f20
# b -> $f22
# c -> $f24
# d -> $f26
# r -> $s0
# s -> $s1
# x -> $s2
# f -> $f28

#int main(void) {
main:

#  float a,b,c,d;
#  std::cout << "\nEvaluacion polinomio f(x) = a x^3  + b x^2 + c x + d  en un intervalo [r,s]\n";
	li	$v0,4
	la	$a0,strTitulo
	syscall

#   std::cout << "\nIntroduzca coeficiente a: ";
	li	$v0,4
	la	$a0,strIntroA
	syscall

#  std::cin >> a;
	li	$v0,6
	syscall
	mov.s	$f20,$f0
#   std::cout << "Introduzca coeficiente b: ";
	li	$v0,4
	la	$a0,strIntroB
	syscall

#   std::cin >> b;
#  std::cin >> b;
	li	$v0,6
	syscall
	mov.s	$f22,$f0

#   std::cout << "Introduzca coeficiente c: ";
	li	$v0,4
	la	$a0,strIntroC
	syscall

#   std::cin >> c;
#  std::cin >> c;
	li	$v0,6
	syscall
	mov.s	$f24,$f0

#   std::cout << "Introduzca coeficiente d: ";
	li	$v0,4
	la	$a0,strIntroD
	syscall

#  std::cin >> d;
	li	$v0,6
	syscall
	mov.s	$f26,$f0

#  int r,s;
#  do {
doWhile:

#     std::cout << "\nLímite inferior r: ";
	li	$v0,4
	la	$a0,strIntroR
	syscall

#    std::cin >> r;
	li	$v0,5
	syscall
	move	$s0,$v0

#     std::cout << "Límite superior s: ";
	li	$v0,4
	la	$a0,strIntroS
	syscall

#    std::cin >> s;
	li	$v0,5
	syscall
	move	$s1,$v0

#  } while (r > s);
	bgt	$s0,$s1,doWhile
doWhile_fin:

#  for (int x = r ; x <= s ; x++) {
	move	$s2,$s0
forX:
	bgt	$s2,$s1,forX_fin

#    float f = a*x*x*x + b*x*x + c*x + d;
	# Pasamos x a copro -> $f4
	mtc1	$s2,$f4
	cvt.s.w	$f4,$f4

	mov.s	$f28,$f26	# f = d
	mul.s	$f6,$f24,$f4	# $f6 = c*x
	add.s	$f28,$f28,$f6	# f += c*x

	mul.s	$f8,$f4,$f4	# y = x*x
	mul.s	$f6,$f22,$f8	# $f6 = b*y = b*x*x
	add.s	$f28,$f28,$f6	# f += b*x*x

	mul.s	$f8,$f8,$f4	# y = y*x = (x*x)*x
	mul.s	$f6,$f20,$f8	# $f6 = a*y= a*x*x*x
	add.s	$f28,$f28,$f6	# f += a*x*x*x

#    if (f >= 2.5) {
ifF:
	li.s	$f8,2.5
	c.lt.s	$f28,$f8
	bc1t	ifF_fin

#      std::cout << "\nf(" << x << ") = " << f;
	li	$v0,4
	la	$a0,strF
	syscall

	li	$v0,1
	move	$a0,$s2
	syscall

	li	$v0,4
	la	$a0,strIgual
	syscall

	li	$v0,2
	mov.s	$f12,$f28
	syscall

#    }
ifF_fin:

#  }

	addi	$s2,1
	b	forX
forX_fin:

#  std::cout << "\n\nTermina el programa\n";
	li	$v0,4
	la	$a0,strTermina
	syscall

#}
	li	$v0,10
	syscall
