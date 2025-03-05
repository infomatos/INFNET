lista = [10, 20, 30, 40, 50]
while True:
    try:
        indice = int(input("Digite um índice para acessar o elemento: "))
        print("Elemento:", lista[indice])
        break
    except IndexError:
        print("Erro: Índice fora do intervalo.")
    except ValueError:
        print("Erro: Entrada inválida. Por favor, insira um número inteiro.")
