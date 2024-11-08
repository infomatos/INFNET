lista = [4, 1, 5, 2, 3, 2, 4, 4]
frequencia = {item: lista.count(item) for item in set(lista)}
print(frequencia)
