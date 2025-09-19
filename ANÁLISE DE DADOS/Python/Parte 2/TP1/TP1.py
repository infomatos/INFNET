import csv
import json

# Exercício 1: Soma dos elementos de uma lista
def soma_lista(numeros):
    """
    Recebe uma lista de números e retorna a soma de seus elementos.
    """
    return sum(numeros)

# Exercício 2: Remover elementos duplicados mantendo a ordem
def remover_duplicados(lista):
    """
    Recebe uma lista e retorna uma nova lista sem elementos duplicados,
    mantendo a ordem de aparição.
    """
    vistos = set()
    resultado = []
    for item in lista:
        if item not in vistos:
            vistos.add(item)
            resultado.append(item)
    return resultado

# Exercício 3: Ordenação personalizada de uma lista de tuplas
def ordenar_por_idade(lista_tuplas):
    """
    Recebe uma lista de tuplas no formato (nome, idade) e retorna a lista ordenada
    da menor para a maior idade.
    """
    return sorted(lista_tuplas, key=lambda tupla: tupla[1])

# Exercício 4: Contar frequência de palavras em um texto
def contar_frequencia_palavras(texto):
    """
    Recebe uma string contendo um texto e retorna um dicionário onde as chaves são palavras
    e os valores são a quantidade de vezes que cada palavra aparece.
    """
    frequencia = {}
    # Pode-se utilizar lower() para considerar palavras sem distinção de maiúsculas/minúsculas.
    palavras = texto.lower().split()
    for palavra in palavras:
        # Removendo pontuações simples
        palavra = palavra.strip(',.!?;:"()[]{}')
        if palavra:
            frequencia[palavra] = frequencia.get(palavra, 0) + 1
    return frequencia

# Exercício 5: Inverter chaves e valores de um dicionário
def inverter_dicionario(dicionario):
    """
    Recebe um dicionário e retorna um novo dicionário com as chaves e valores invertidos.
    Supõe que os valores originais são únicos e passíveis de serem chaves.
    """
    return {valor: chave for chave, valor in dicionario.items()}

# Exercício 6: Unir dois dicionários somando valores comuns
def unir_dicionarios(d1, d2):
    """
    Recebe dois dicionários com chaves e valores numéricos e retorna um novo dicionário
    contendo todas as chaves dos dois. Se uma chave estiver em ambos, os valores são somados.
    """
    resultado = {}
    todas_chaves = set(d1) | set(d2)
    for chave in todas_chaves:
        resultado[chave] = d1.get(chave, 0) + d2.get(chave, 0)
    return resultado

# Exercício 7: União, interseção e diferença de conjuntos
def operacoes_conjuntos(conj1, conj2):
    """
    Recebe dois conjuntos e retorna um dicionário com as chaves:
      - "união": união dos conjuntos.
      - "interseção": interseção dos conjuntos.
      - "diferença": elementos que estão em conj1 mas não em conj2.
    """
    return {
        "união": conj1 | conj2,
        "interseção": conj1 & conj2,
        "diferença": conj1 - conj2
    }

# Exercício 8: Encontrar elementos únicos em uma lista usando set
def elementos_unicos(lista):
    """
    Recebe uma lista de números e retorna uma nova lista contendo apenas os elementos únicos.
    A ordem não é garantida.
    """
    return list(set(lista))

# Exercício 9: Testar subconjunto e superconjunto
def eh_subconjunto(conj1, conj2):
    """
    Recebe dois conjuntos e retorna True se o primeiro for um subconjunto do segundo,
    caso contrário, retorna False.
    """
    return conj1.issubset(conj2)

# Exercício 10: Ler um arquivo CSV e imprimir o conteúdo
def ler_csv(nome_arquivo):
    """
    Recebe o nome de um arquivo CSV, lê seu conteúdo e imprime cada linha.
    """
    try:
        with open(nome_arquivo, mode='r', newline='', encoding='utf-8') as arquivo:
            leitor = csv.reader(arquivo)
            for linha in leitor:
                print(linha)
    except FileNotFoundError:
        print(f"Arquivo {nome_arquivo} não encontrado.")

# Exercício 11: Escrever dados em um arquivo CSV
def escrever_csv(nome_arquivo, lista_dicionarios):
    """
    Recebe o nome de um arquivo CSV e uma lista de dicionários, onde cada dicionário representa uma linha.
    Cria o arquivo CSV e escreve os dados incluindo os cabeçalhos.
    """
    if not lista_dicionarios:
        print("Lista de dados vazia.")
        return

    # Obtém os cabeçalhos a partir das chaves do primeiro dicionário
    cabecalhos = lista_dicionarios[0].keys()

    with open(nome_arquivo, mode='w', newline='', encoding='utf-8') as arquivo:
        escritor = csv.DictWriter(arquivo, fieldnames=cabecalhos)
        escritor.writeheader()
        for linha in lista_dicionarios:
            escritor.writerow(linha)

# Exercício 12: Ler um arquivo JSON e retornar um dicionário
def ler_json(nome_arquivo):
    """
    Recebe o nome de um arquivo JSON, lê o conteúdo e retorna um dicionário com os dados.
    """
    try:
        with open(nome_arquivo, mode='r', encoding='utf-8') as arquivo:
            dados = json.load(arquivo)
        return dados
    except FileNotFoundError:
        print(f"Arquivo {nome_arquivo} não encontrado.")
        return None

# Exercício 13: Escrever um dicionário em um arquivo JSON
def escrever_json(nome_arquivo, dados):
    """
    Recebe um nome de arquivo e um dicionário e salva os dados em formato JSON,
    com formatação para fácil leitura.
    """
    with open(nome_arquivo, mode='w', encoding='utf-8') as arquivo:
        json.dump(dados, arquivo, indent=4, ensure_ascii=False)

# Exercício 14: Processar um arquivo CSV e criar um dicionário de cidades para nomes
def processar_csv_cidades(nome_arquivo):
    """
    Recebe um arquivo CSV contendo colunas 'nome' e 'cidade', e retorna um dicionário
    onde as chaves são as cidades e os valores são listas dos nomes das pessoas pertencentes a cada cidade.
    """
    resultado = {}
    try:
        with open(nome_arquivo, mode='r', newline='', encoding='utf-8') as arquivo:
            leitor = csv.DictReader(arquivo)
            for linha in leitor:
                cidade = linha.get("cidade")
                nome = linha.get("nome")
                if cidade and nome:
                    if cidade in resultado:
                        resultado[cidade].append(nome)
                    else:
                        resultado[cidade] = [nome]
        return resultado
    except FileNotFoundError:
        print(f"Arquivo {nome_arquivo} não encontrado.")
        return None

# Exercício 15: Criar um conjunto a partir de um arquivo de texto (set de nomes únicos)
def conjunto_nomes(nome_arquivo):
    """
    Recebe um arquivo de texto com uma lista de nomes (um por linha) e retorna um conjunto
    contendo os nomes únicos encontrados.
    """
    nomes = set()
    try:
        with open(nome_arquivo, mode='r', encoding='utf-8') as arquivo:
            for linha in arquivo:
                nome = linha.strip()
                if nome:
                    nomes.add(nome)
        return nomes
    except FileNotFoundError:
        print(f"Arquivo {nome_arquivo} não encontrado.")
        return set()

# Exercício 16: Criar um índice invertido de palavras em um texto
def indice_invertido(nome_arquivo):
    """
    Recebe um arquivo de texto e retorna um dicionário onde as chaves são palavras e os valores são
    conjuntos com os números das linhas em que cada palavra aparece.
    """
    indice = {}
    try:
        with open(nome_arquivo, mode='r', encoding='utf-8') as arquivo:
            for num_linha, linha in enumerate(arquivo, start=1):
                # Converte para minúsculas e separa as palavras
                palavras = linha.lower().strip().split()
                for palavra in palavras:
                    # Remove pontuações básicas
                    palavra = palavra.strip(',.!?;:"()[]{}')
                    if palavra:
                        if palavra in indice:
                            indice[palavra].add(num_linha)
                        else:
                            indice[palavra] = {num_linha}
        return indice
    except FileNotFoundError:
        print(f"Arquivo {nome_arquivo} não encontrado.")
        return {}

