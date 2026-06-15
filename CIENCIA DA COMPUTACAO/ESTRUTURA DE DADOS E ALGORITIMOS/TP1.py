import time

# ---------- Leitura do arquivo ----------
def ler_arquivo_txt(nome_arquivo):
    arquivos = []
    with open(nome_arquivo, "r", encoding="utf-8", errors="replace") as f:
        for linha in f:
            linha = linha.strip()
            if linha != "":
                arquivos.append(linha)
    return arquivos


# ---------- Algoritmos de ordenação ----------
def bubble_sort(lista):
    dados = lista[:]  # cópia
    n = len(dados)

    for i in range(n):
        trocou = False
        for j in range(0, n - 1 - i):
            if dados[j] > dados[j + 1]:
                dados[j], dados[j + 1] = dados[j + 1], dados[j]
                trocou = True
        if not trocou:
            break

    return dados


def selection_sort(lista):
    dados = lista[:]
    n = len(dados)

    for i in range(n):
        menor_indice = i
        for j in range(i + 1, n):
            if dados[j] < dados[menor_indice]:
                menor_indice = j
        if menor_indice != i:
            dados[i], dados[menor_indice] = dados[menor_indice], dados[i]

    return dados


def insertion_sort(lista):
    dados = lista[:]

    for i in range(1, len(dados)):
        chave = dados[i]
        j = i - 1
        while j >= 0 and dados[j] > chave:
            dados[j + 1] = dados[j]
            j -= 1
        dados[j + 1] = chave

    return dados


# ---------- Medição de tempo ----------
def medir_tempo(funcao_ordenacao, lista):
    inicio = time.perf_counter()
    resultado = funcao_ordenacao(lista)
    fim = time.perf_counter()
    tempo = fim - inicio
    return tempo, resultado


# ---------- Programa principal ----------
def main():
    print("Programa 1 (Ordenação + Tempo)\n")

    nome_txt = input("Aperte ENTER para começar: ")
    if nome_txt == "":
        nome_txt = "listagem_arquivos.txt"

    arquivos = ler_arquivo_txt(nome_txt)
    total = len(arquivos)

    if total == 0:
        print("O arquivo está vazio ou não foi possível ler.")
        return

    print(f"\nTotal de itens lidos: {total}")

    # Medindo os 3 algoritmos
    tempo_bubble, ordenado_bubble = medir_tempo(bubble_sort, arquivos)
    tempo_selection, ordenado_selection = medir_tempo(selection_sort, arquivos)
    tempo_insertion, ordenado_insertion = medir_tempo(insertion_sort, arquivos)

    print("Tempos de execução:")
    print(f"- Bubble Sort:    {tempo_bubble:.6f} s")
    print(f"- Selection Sort: {tempo_selection:.6f} s")
    print(f"- Insertion Sort: {tempo_insertion:.6f} s")

    # gravando o resultado em um arquivo txt
    with open("tempos_ordenacao.txt", "a", encoding="utf-8") as log:
        log.write(f"\n--- Execução ---\n")
        log.write(f"Itens: {len(arquivos)}\n")
        log.write(f"Bubble Sort:    {tempo_bubble:.6f} s\n")
        log.write(f"Selection Sort: {tempo_selection:.6f} s\n")
        log.write(f"Insertion Sort: {tempo_insertion:.6f} s\n")

    print("\nResultado salvo em: tempos_ordenacao.txt")

main()
