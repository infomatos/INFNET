# Sistema de Controle de Estoque

estoque_inicial = "Notebook Dell;201;15;3200.00;4500.00#Notebook Lenovo;202;10;2800.00;4200.00#Mouse Logitech;203;50;70.00;150.00#Mouse Razer;204;40;120.00;250.00#Monitor Samsung;205;10;800.00;1200.00#Monitor LG;206;8;750.00;1150.00#Teclado Mecânico Corsair;207;30;180.00;300.00#Teclado Mecânico Razer;208;25;200.00;350.00#Impressora HP;209;5;400.00;650.00#Impressora Epson;210;3;450.00;700.00#Monitor Dell;211;12;850.00;1250.00#Monitor AOC;212;7;700.00;1100.00"

# Conversão inicial do estoque para lista de dicionários
def carregar_estoque(estoque_str):
    produtos = []
    for item in estoque_str.split("#"):
        descricao, codigo, quantidade, custo, preco_venda = item.split(";")
        produtos.append({
            "descricao": descricao,
            "codigo": int(codigo),
            "quantidade": int(quantidade),
            "custo": float(custo),
            "preco_venda": float(preco_venda)
        })
    return produtos

# =======Funções principais========

def cadastrar_produto(produtos):
    """
    Cadastra um novo produto no sistema, garantindo que o código seja único e os valores sejam válidos.
    """
    descricao = input("Descrição: ")
    while not descricao:
        print("Erro: A descrição não pode estar vazia.")
        descricao = input("Descrição: ")
    
    while True:
        codigo = input("Código: ")
        while not codigo:
            print("Erro: O código precisa ser defindo.")
            codigo = input("Código: ")
        while not codigo.isdigit():
            print("Erro: O código deve ser um número inteiro válido.")
            codigo = input("Código: ")
        codigo = int(codigo)
        if any(produto["codigo"] == codigo for produto in produtos):
            print("Erro: Código já existente! Tente novamente.")
        else:
            break

    while True:
        quantidade = input("Quantidade de unidades: ")
        while not quantidade:
            print("Erro: Voce precisa definir uma quantidade inicial.")
            quantidade = input("Quantidade de unidades: ")
        while not quantidade.isdigit():
            print("Erro: O código deve ser um número inteiro válido e positivo.")
            quantidade = input("Quantidade de unidades: ")
        quantidade = int(quantidade)
        break
    
    while True:
        custo = input("Custo unitário: ")
        while not custo:
            print("Erro: Voce precisa definir o custo do produto.")
            custo = input("Custo unitário: ")
        if not custo.replace('.', '', 1).isdigit():
            print("Erro: O custo deve ser um número válido e positivo.")
            continue
        custo = float(custo)
        break
    
    while True:
        preco_venda = input("Preço de venda: ")
        while not preco_venda:
            print("Erro: Voce precisa definir um preço de venda.")
            preco_venda = input("Preço de venda: ")
        if not preco_venda.replace('.', '', 1).isdigit():
            print("Erro: O preço de venda deve ser um número válido.")
            continue
        preco_venda = float(preco_venda)
        if preco_venda < custo:
            print("Erro: O preço de venda não pode ser menor que o custo.")
        else:
            break
    
    produtos.append({
        "descricao": descricao,
        "codigo": codigo,
        "quantidade": quantidade,
        "custo": custo,
        "preco_venda": preco_venda
    })
    print("Produto cadastrado com sucesso!")

def listar_produtos(produtos, ordem="asc"):
    """
    Exibe a lista de produtos cadastrados, ordenados pela quantidade em estoque.
    Parâmetros:
        produtos (list): Lista de produtos.
        ordem (str): Define a ordem da listagem, podendo ser "asc" para crescente ou "desc" para decrescente.
    """
    if ordem == "asc":
        produtos_ordenados = sorted(produtos, key=lambda x: x["quantidade"])
    elif ordem == "desc":
        produtos_ordenados = sorted(produtos, key=lambda x: x["quantidade"], reverse=True)
    else:
        print("Ordem inválida! Use 'asc' para crescente ou 'desc' para decrescente.")
        return

    print("\nEstoque Atual (Ordenado por Quantidade):")
    print("\nDescrição".ljust(30), 
          "Código".ljust(10), 
          "Quantidade".ljust(10), 
          "Custo".ljust(10), 
          "Preço Venda")
    for produto in produtos_ordenados:
        print(produto["descricao"].ljust(30), 
              str(produto["codigo"]).ljust(10), 
              str(produto["quantidade"]).ljust(10), 
              f"{produto['custo']:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".").ljust(10), 
              f"{produto['preco_venda']:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))

def buscar_produto(produtos, descricao=None, codigo=None):
    """
    Busca produtos no estoque com base na descrição ou código.
    O usuário pode fornecer a descrição ou o código para realizar a busca.
    """
    while not descricao and not codigo:
        print("É preciso fornecer a descrição ou o código do produto para realizar a busca.")
        descricao=input("Descrição (ou pressione Enter para ignorar): ") 
        codigo=int(input("Código (ou pressione 0 para ignorar): "))

    if descricao:
        resultados = [produto for produto in produtos if descricao.lower() in produto["descricao"].lower()]
    elif codigo:
        resultados = [produto for produto in produtos if produto["codigo"] == codigo]

    if not resultados:
        print("\nNenhum produto encontrado.")
    else:
        print("\nProdutos encontrados:")
        for produto in resultados:
            print(f"\nDescrição: {produto['descricao']}, Código: {produto['codigo']}, Quantidade: {produto['quantidade']}, "
                  f"Custo: R${produto['custo']:.2f}, Preço Venda: R${produto['preco_venda']:.2f}")

def consultar_produtos_esgotados(produtos):
    """
    Exibe todos os produtos com quantidade igual a zero (esgotados).
    """
    produtos_esgotados = [produto for produto in produtos if produto["quantidade"] <= 0]

    if not produtos_esgotados:
        print("Não há produtos esgotados no momento.")
    else:
        print("\nProdutos esgotados:")
        print("Código".ljust(10), "Descrição".ljust(13), "Quantidade".ljust(12))
        for produto in produtos_esgotados:
            print(str(produto["codigo"]).ljust(10),
                  produto["descricao"].ljust(13),
                  produto["quantidade".ljust(10)],)
                  #f"{produto['custo']:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".").ljust(10),
                  #f"{produto['preco_venda']:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))

def filtrar_produtos_abaixo_minimo(produtos, limite_minimo=10):
    """
    Filtra e exibe produtos com quantidade abaixo de um limite mínimo.
    Caso o limite não seja fornecido, utiliza o valor padrão de 10.
    
    Parâmetros:
        produtos (list): Lista de produtos.
        limite_minimo (int): Quantidade mínima para o filtro (opcional, padrão=10).
    """
    produtos_filtrados = [produto for produto in produtos if produto["quantidade"] < limite_minimo]

    if not produtos_filtrados:
        print(f"\nNão há produtos com quantidade abaixo de {limite_minimo}.")
    else:
        print(f"\nProdutos com quantidade abaixo de {limite_minimo}:")
        print("\nDescrição".ljust(30), "Código".ljust(10), "Quantidade".ljust(10), "Custo".ljust(10), "Preço Venda")
        for produto in produtos_filtrados:
            print(produto["descricao"].ljust(30),
                  str(produto["codigo"]).ljust(10),
                  str(produto["quantidade"]).ljust(10),
                  f"{produto['custo']:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".").ljust(10),
                  f"{produto['preco_venda']:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))

def remover_produto(produtos, codigo):
    for produto in produtos:
        if produto["codigo"] == codigo:
            produtos.remove(produto)
            print("Produto removido com sucesso!")
            return
    print("Produto não encontrado!")

def atualizar_estoque(produtos, codigo, quantidade):
    """
    Atualiza a quantidade de um produto específico no estoque.
    Não permite que o estoque fique negativo.
    
    Parâmetros:
        produtos (list): Lista de produtos.
        codigo (int): Código do produto a ser atualizado.
        quantidade (int): Quantidade a ser adicionada (positiva) ou removida (negativa).
    """
    for produto in produtos:
        if produto["codigo"] == codigo:
            nova_quantidade = produto["quantidade"] + quantidade
            if nova_quantidade < 0:
                print(f"Erro: Estoque insuficiente para o produto '{produto['descricao']}'.")
                print(f"Quantidade atual: {produto['quantidade']}, tentativa de ajuste: {quantidade}.")
                return
            produto["quantidade"] = nova_quantidade
            print(f"Estoque atualizado com sucesso! Novo estoque de '{produto['descricao']}': {produto['quantidade']}")
            return
    
    print(f"Produto com código {codigo} não encontrado.")

def atualizar_preco(produtos, codigo, novo_preco):
    """"Atualiza o preço individual de cada produto"""
    for produto in produtos:
        if produto["codigo"] == codigo:
            while novo_preco < produto["custo"]:
                print("O preço de venda não pode ser menor que o preço de custo ", f"R$ {produto["custo"]:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))
                novo_preco = float(input("Novo preço de venda: "))
            produto["preco_venda"] = novo_preco
            print("Preço atualizado com sucesso!")
            return
    print("Produto não encontrado!")

def calcular_valor_total_estoque(produtos):
    print("\nValor total do estoque:")
    estoque_total = sum(produto["quantidade"] * produto["preco_venda"] for produto in produtos)
    return estoque_total

def calcular_lucro_presumido(produtos):
    print("\nLucro presumido do estoque atual com base no preço de custo:")
    lucro_presumido = sum((produto["preco_venda"] - produto["custo"]) * produto["quantidade"] for produto in produtos)
    return lucro_presumido

def exibir_relatorio_estoque(produtos):
    """
    Exibe um relatório geral do estoque, incluindo descrição, código, quantidade,
    custo, preço de venda, valor total por item, margem de lucro e o custo total e faturamento total do estoque.
    """
    print("\nInventário Total:")
    print("\nDescrição".ljust(30), 
          "Código".ljust(10), 
          "Quantidade".ljust(10), 
          "Custo".ljust(15), 
          "Preço Venda".ljust(15), 
          "Valor Total".ljust(15), 
          "Margem Lucro")
    
    total_custo = 0
    total_faturamento = 0
    total_quantidade = 0

    for produto in produtos:
        valor_total = produto["quantidade"] * produto["preco_venda"]
        margem_lucro = produto["preco_venda"] - produto["custo"]
        total_custo += produto["quantidade"] * produto["custo"]
        total_faturamento += valor_total
        total_quantidade += produto["quantidade"]
        
        print(produto["descricao"].ljust(30), 
              str(produto["codigo"]).ljust(10), 
              str(produto["quantidade"]).ljust(10), 
              f"{produto['custo']:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".").ljust(15), 
              f"{produto['preco_venda']:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".").ljust(15), 
              f"{valor_total:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".").ljust(15), 
              f"{margem_lucro:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))

    print("\nQuantidade Total no Estoque:", total_quantidade, "itens.")
    print("Custo Total do Estoque: R$", f"{total_custo:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))
    print("Faturamento Total do Estoque: R$", f"{total_faturamento:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))


# =====Menu====
def menu():
    while True:
        print("\n---===Menu===---")
        print("\n1.  Listar produtos\n2.  Listagem ordenada (por quantidade)\n3.  Cadastrar produto\n4.  Buscar produto\n5.  Remover produto\n6.  Verificar estoques zerados\n7.  Checar níveis de estoque\n8.  Atualizar estoque\n9.  Atualizar preço\n10. Valor total do estoque\n11. Lucro presumido\n12. Exibir inventário total\n13. Sair")
        print(" ")
        opcao = input("Escolha uma opção: ")
        if opcao == "1":    #listagem geral
            listar_produtos(produtos)
        elif opcao == "2":  #listagem ordenada por quantidade
            ordem = input("Ordenar por quantidade: 'asc' para crescente, 'desc' para decrescente: ").strip().lower()
            listar_produtos(produtos, ordem)
        elif opcao == "3":  #inserir um produto novo
            cadastrar_produto(produtos)
        elif opcao == "4":  #buscar produtos por desc ou id
            buscar_produto(produtos, descricao=input("Descrição (ou pressione Enter para ignorar): "), codigo=int(input("Código (ou pressione 0 para ignorar): ")))
        elif opcao == "5":  #remover produto
            remover_produto(produtos, int(input("Código: ")))
        elif opcao == "6":  #consultar estoques zerados
            consultar_produtos_esgotados(produtos)
        elif opcao == "7":  #filtrar produtos por nível de estoque
            resp = input("Deseja inserir um limite (padrão 10)? (s/n)")
            if resp == "s":
                limite_minimo = int(input("Quantidade mínima: "))
                filtrar_produtos_abaixo_minimo(produtos, limite_minimo)
            else:  
            #limite_minimo = int(input("Quantidade mínima (opcional. Padrão é 10): "))
                filtrar_produtos_abaixo_minimo(produtos)
        elif opcao == "8":  #alterar estoque de um produto
            atualizar_estoque(produtos, int(input("Código: ")), int(input("Quantidade (negativo para saída): ")))
        elif opcao == "9":  #atualizar preço
            atualizar_preco(produtos, int(input("Código: ")), float(input("Novo preço de venda: ")))
        elif opcao == "10": #valor total do estoque
            print(f"R$ {calcular_valor_total_estoque(produtos):,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))
        elif opcao == "11": #calcular lucro presumido
            print(f"R$ {calcular_lucro_presumido(produtos):,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))
        elif opcao == "12": #relatório de estoque
            exibir_relatorio_estoque(produtos)
        elif opcao == "13": #sair
            print("Saindo do sistema...")
            break
        else:
            print("Opção inválida!")

# Execução inicial
produtos = carregar_estoque(estoque_inicial)
menu()