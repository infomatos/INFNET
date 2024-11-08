lista = [-1, 2, -3, 7, -5, 6, 3]
lista.sort()
mais_proximo_zero = (lista[0], lista[1])
for i in range(len(lista)):
    for j in range(i + 1, len(lista)):
        if abs(lista[i] + lista[j]) < abs(sum(mais_proximo_zero)):
            mais_proximo_zero = (lista[i], lista[j])
print("Dois números cuja soma é mais próxima de zero:", mais_proximo_zero)
