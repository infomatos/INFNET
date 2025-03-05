
def quadrados_lista():
    """Recebe uma lista de números e retorna os quadrados dos números."""
    print([x**2 for x in map(int, input("Digite números separados por espaço: ").split())])

def numeros_modificados():
    """Retorna 0 se o número for menor que 10, caso contrário retorna o próprio número."""
    print([0 if x < 10 else x for x in map(int, input("Digite números separados por espaço: ").split())])

def palavras_por_frase():
    """Recebe uma história e retorna o número de palavras em cada frase."""
    print([len(frase.split()) for frase in input("Digite uma história: ").split('.') if frase.strip()])

def contar_vogais():
    """Conta o número de vogais em cada frase de uma lista de frases."""
    print([sum(1 for c in frase if c.lower() in 'aeiou') for frase in input("Digite frases separadas por ponto: ").split('.')])

# =============================================================================

def maiores_idade(idades):
    """Retorna um dicionário com pessoas maiores de idade."""
    return {nome: idade for nome, idade in idades.items() if idade >= 18}

def remover_palavras_indesejadas(texto, indesejadas):
    """Remove palavras indesejadas de um texto."""
    return ' '.join([palavra for palavra in texto.split() if palavra not in indesejadas])

def alternar_maiusculas_minusculas(texto):
    """Alterna entre maiúsculas e minúsculas em uma string."""
    return ''.join([c.upper() if i % 2 == 0 else c.lower() for i, c in enumerate(texto)])

def elementos_unicos_listas(lista_de_listas):
    """Retorna uma lista com elementos únicos de uma lista de listas."""
    elementos = set()
    for sublista in lista_de_listas:
        elementos.update(sublista)
    return sorted(elementos)

def intercalar_listas(lista1, lista2):
    """Intercala duas listas de palavras."""
    resultado = []
    for i in range(max(len(lista1), len(lista2))):
        if i < len(lista1):
            resultado.append(lista1[i])
        if i < len(lista2):
            resultado.append(lista2[i])
    return ' '.join(resultado)

def dividir_palavras_por_tamanho(lista_palavras, n):
    """Divide uma lista de palavras por comprimento."""
    menor_igual = [p for p in lista_palavras if len(p) <= n]
    maior = [p for p in lista_palavras if len(p) > n]
    return [menor_igual, maior]

def inserir_palavra(lista, nova_palavra):
    """Insere uma nova palavra na lista."""
    if len(lista) < 3:
        lista.append(nova_palavra)
    else:
        posicao = int(input("Digite a posição para inserir a nova palavra: "))
        lista.insert(posicao, nova_palavra)
    return lista

def combinar_listas(lista1, lista2):
    """Combina duas listas de números."""
    lista1.extend(lista2)
    return lista1

def remover_duplicatas(lista):
    """Remove duplicatas mantendo apenas a primeira ocorrência."""
    resultado = []
    for palavra in lista:
        if palavra not in resultado:
            resultado.append(palavra)
    return resultado

def gerenciar_compras(lista_compras):
    """Permite remover o último item da lista de compras."""
    if lista_compras:
        lista_compras.pop()
        print("Lista atualizada:", lista_compras)
    else:
        print("A lista está vazia!")

def manipular_string(string):
    """Manipula uma string com operações baseadas em índices."""
    print("String original:", string)
    inicio = int(input("Digite o índice de início: "))
    fim = int(input("Digite o índice de fim: "))
    print("Substring:", string[inicio:fim])

def gerenciar_lista_compras(lista):
    """Gerencia uma lista de compras com diferentes operações."""
    while True:
        comando = input("Digite um comando (fim, remover [produto/índice], adicionar [índice produto]): ")
        if comando == "fim":
            break
        elif comando.startswith("remover"):
            _, item = comando.split(" ", 1)
            if item.isdigit():
                lista.pop(int(item))
            else:
                lista.remove(item)
        elif comando.startswith("adicionar"):
            _, restante = comando.split(" ", 1)
            indice, produto = restante.split(" ", 1)
            lista.insert(int(indice), produto)
        print("Lista atualizada:", lista)

# ================================================================

'''
quadrados_lista()
numeros_modificados()
palavras_por_frase()
contar_vogais()
print(maiores_idade({'Alice': 22, 'Bob': 17, 'Carol': 19, 'David': 16}))
print(remover_palavras_indesejadas("python é incrível", ["é"]))
print(alternar_maiusculas_minusculas("desenvolvendo habilidades"))
print(elementos_unicos_listas([[2, 4, 6], [4, 5, 1, 6], [2, 2, 6]]))
print(intercalar_listas(["maçã", "banana"], ["laranja", "uva", "manga"]))
print(dividir_palavras_por_tamanho(["python", "é", "incrível"], 4))
print(inserir_palavra(["primeiro", "segundo"], "novo"))
print(combinar_listas([1, 2, 3], [4, 5, 6]))
print(remover_duplicatas(["maçã", "banana", "maçã", "laranja"]))
gerenciar_compras(["maçã", "banana", "laranja"])
manipular_string("Python é incrível!")
gerenciar_lista_compras(["maçã", "banana", "laranja"])
'''