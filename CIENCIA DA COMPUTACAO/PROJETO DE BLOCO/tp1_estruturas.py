import time
from collections import deque

# -------------------- Leitura do arquivo --------------------
def ler_arquivo_txt(nome_arquivo):
    arquivos = []
    with open(nome_arquivo, "r", encoding="utf-8", errors="replace") as f:
        for linha in f:
            linha = linha.strip()
            if linha != "":
                arquivos.append(linha)
    return arquivos


# -------------------- Medição de tempo --------------------
def medir_tempo(funcao):
    inicio = time.perf_counter()
    retorno = funcao()
    fim = time.perf_counter()
    return (fim - inicio), retorno


# -------------------- Posições pedidas --------------------
def obter_posicoes(total):
    # posições 1, 100, 1000 e última
    posicoes = [1, 100, 1000]
    if total > 0:
        posicoes.append(total)  # última

    # remover duplicadas mantendo ordem
    final = []
    for p in posicoes:
        if p not in final:
            final.append(p)
    return final


def pegar_por_posicao_lista(lista, posicao_1_based):
    idx = posicao_1_based - 1
    if 0 <= idx < len(lista):
        return lista[idx]
    return "<posição não existe>"


# -------------------- Testes: Hashtable --------------------
def testar_hashtable(arquivos, posicoes):
    total = len(arquivos)

    # 1) Armazenar
    def armazenar():
        tabela = {}
        for i in range(total):
            tabela[i + 1] = arquivos[i]
        return tabela

    t_store, tabela = medir_tempo(armazenar)

    # 2) Recuperar posições
    def recuperar():
        resultado = {}
        for p in posicoes:
            resultado[p] = tabela.get(p, "<posição não existe>")
        return resultado

    t_get, recuperados = medir_tempo(recuperar)

    # 3) Adicionar item
    def adicionar():
        chave_nova = total + 1
        tabela[chave_nova] = "arquivo_adicionado_hashtable.txt"
        return chave_nova

    t_add, chave_adicionada = medir_tempo(adicionar)

    # 4) Remover item adiciondo
    def remover():
        return tabela.pop(chave_adicionada, "<não removeu>")

    t_remove, removido = medir_tempo(remover)

    return t_store, t_get, t_add, t_remove, recuperados, removido


# -------------------- Testes: Pilha --------------------
def testar_pilha(arquivos, posicoes):
    # 1) Armazenar
    def armazenar():
        pilha = arquivos[:]  # cópia
        return pilha

    t_store, pilha = medir_tempo(armazenar)

    # 2) Recuperar posições
    def recuperar():
        resultado = {}
        for p in posicoes:
            resultado[p] = pegar_por_posicao_lista(pilha, p)
        return resultado

    t_get, recuperados = medir_tempo(recuperar)

    # 3) Adicionar item
    def adicionar():
        pilha.append("arquivo_adicionado_pilha.txt")

    t_add, _ = medir_tempo(adicionar)

    # 4) Remover item
    def remover():
        if len(pilha) == 0:
            return "<pilha vazia>"
        return pilha.pop()

    t_remove, removido = medir_tempo(remover)

    return t_store, t_get, t_add, t_remove, recuperados, removido


# -------------------- Testes: Fila --------------------
def testar_fila(arquivos, posicoes):
    # 1) Armazenar
    def armazenar():
        fila = deque(arquivos)
        return fila

    t_store, fila = medir_tempo(armazenar)

    # 2) Recuperar posições
    def recuperar():
        resultado = {}
        lista_temp = list(fila)
        for p in posicoes:
            resultado[p] = pegar_por_posicao_lista(lista_temp, p)
        return resultado

    t_get, recuperados = medir_tempo(recuperar)

    # 3) Adicionar item
    def adicionar():
        fila.append("arquivo_adicionado_fila.txt")

    t_add, _ = medir_tempo(adicionar)

    # 4) Remover item
    def remover():
        if len(fila) == 0:
            return "<fila vazia>"
        return fila.popleft()

    t_remove, removido = medir_tempo(remover)

    return t_store, t_get, t_add, t_remove, recuperados, removido


# -------------------- Programa principal --------------------
def main():
    print("Programa 2 - Estruturas (Hashtable, Pilha, Fila) + Tempo\n")

    nome_txt = input("Aperte ENTER para iniciar: ")
    if nome_txt == "":
        nome_txt = "listagem_arquivos.txt"

    arquivos = ler_arquivo_txt(nome_txt)
    total = len(arquivos)

    if total == 0:
        print("O arquivo está vazio ou não foi possível ler.")
        return

    posicoes = obter_posicoes(total)

    # Executa testes
    th = testar_hashtable(arquivos, posicoes)
    tp = testar_pilha(arquivos, posicoes)
    tf = testar_fila(arquivos, posicoes)

    # Monta saída para tela e arquivo
    saida = []
    saida.append("\n--- INICIO ---")
    saida.append(f"Arquivo lido: {nome_txt}")
    saida.append(f"Total de itens: {total}")
    saida.append(f"Posições testadas: {posicoes}\n")

    def formatar_resultado(nome, dados):
        t_store, t_get, t_add, t_remove, recuperados, removido = dados
        total_tempo = t_store + t_get + t_add + t_remove

        saida.append(f"[{nome}]")
        saida.append(f"Tempo armazenar: {t_store:.6f} s")
        saida.append(f"Tempo recuperar posições: {t_get:.6f} s")
        saida.append(f"Tempo adicionar item: {t_add:.6f} s")
        saida.append(f"Tempo remover item: {t_remove:.6f} s")
        saida.append(f"Tempo total (soma): {total_tempo:.6f} s")

        saida.append("\nRecuperados:")
        for p in posicoes:
            saida.append(f"  Posição {p}: {recuperados[p]}")
        saida.append(f"Item removido (teste add/remove): {removido}\n")

    formatar_resultado("HASHTABLE (dict)", th)
    formatar_resultado("PILHA (list)", tp)
    formatar_resultado("FILA (deque)", tf)

    # imprimir na tela
    print("\n".join(saida))

    # salvar no arquivo
    with open("resultados_estruturas.txt", "a", encoding="utf-8") as f:
        f.write("\n".join(saida))
        f.write("\n")

    print("\nArquivo gerado/atualizado: resultados_estruturas.txt")


main()