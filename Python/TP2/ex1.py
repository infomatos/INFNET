idades = {'Alice': 22, 'Bob': 17, 'Carol': 19, 'David': 16}
maiores = {nome: idade for nome, idade in idades.items() if idade >= 18}
print(maiores)
