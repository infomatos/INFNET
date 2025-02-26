agenda = {}
next_id = 1  # Contador para gerar IDs únicos para cada contato

def adicionar_contato():
    global next_id
    nome = input("Nome do contato: ").strip()
    data_nasc = input("Data de nascimento (DD/MM/AAAA): ").strip()
    
    # Cadastro de endereços
    enderecos = []
    while True:
        print("\n--- Informe um Endereço ---")
        rua = input("Rua: ").strip()
        numero = input("Número: ").strip()
        complemento = input("Complemento: ").strip()
        bairro = input("Bairro: ").strip()
        municipio = input("Município: ").strip()
        estado = input("Estado: ").strip()
        cep = input("CEP: ").strip()
        endereco = {
            "rua": rua,
            "numero": numero,
            "complemento": complemento,
            "bairro": bairro,
            "municipio": municipio,
            "estado": estado,
            "cep": cep
        }
        enderecos.append(endereco)
        op = input("Deseja adicionar outro endereço? (s/n): ").strip().lower()
        if op != 's':
            break

    # Cadastro de telefones
    telefones = []
    print("\n--- Adicione os Telefones (aperte Enter para encerrar) ---")
    while True:
        tel = input("Telefone: ").strip()
        if tel == "":
            break
        telefones.append(tel)
    
    # Cadastro de emails
    emails = []
    print("\n--- Adicione os Emails (aperte Enter para encerrar) ---")
    while True:
        email = input("Email: ").strip()
        if email == "":
            break
        emails.append(email)
    
    # Armazena o contato na agenda
    agenda[next_id] = {
        "nome": nome,
        "data_nascimento": data_nasc,
        "enderecos": enderecos,
        "telefones": telefones,
        "emails": emails
    }
    
    print(f"\nContato adicionado com sucesso! ID do contato: {next_id}\n")
    next_id += 1

def consultar_contato():
    buscar = input("Digite o ID do contato ou o nome: ").strip()
    if buscar.isdigit():
        cid = int(buscar)
        if cid in agenda:
            exibir_contato(cid, agenda[cid])
        else:
            print("Contato não encontrado!\n")
    else:
        encontrado = False
        for cid, contato in agenda.items():
            if contato["nome"].lower() == buscar.lower():
                exibir_contato(cid, contato)
                encontrado = True
        if not encontrado:
            print("Contato não encontrado!\n")

def exibir_contato(cid, contato):
    print(f"\n--- Dados do Contato (ID {cid}) ---")
    print("Nome:", contato["nome"])
    print("Data de Nascimento:", contato["data_nascimento"])
    print("Endereços:")
    for i, end in enumerate(contato["enderecos"], start=1):
        print(f"  Endereço {i}:")
        for campo, valor in end.items():
            print(f"    {campo.capitalize()}: {valor}")
    print("Telefones:")
    for tel in contato["telefones"]:
        print("  -", tel)
    print("Emails:")
    for email in contato["emails"]:
        print("  -", email)
    print("---------------------------\n")

def alterar_contato():
    buscar = input("Digite o ID do contato a alterar: ").strip()
    if not buscar.isdigit():
        print("ID inválido!\n")
        return
    cid = int(buscar)
    if cid not in agenda:
        print("Contato não encontrado!\n")
        return

    contato = agenda[cid]
    print("\nDeixe em branco para manter o valor atual.")
    novo_nome = input(f"Nome [{contato['nome']}]: ").strip()
    if novo_nome:
        contato["nome"] = novo_nome

    nova_data = input(f"Data de nascimento [{contato['data_nascimento']}]: ").strip()
    if nova_data:
        contato["data_nascimento"] = nova_data

    # Alterar endereços existentes
    print("\n--- Alterar Endereços ---")
    for i, end in enumerate(contato["enderecos"], start=1):
        print(f"\nEndereço {i}:")
        for campo, valor in end.items():
            novo_valor = input(f"{campo.capitalize()} [{valor}]: ").strip()
            if novo_valor:
                end[campo] = novo_valor

    op_end = input("Deseja adicionar um novo endereço? (s/n): ").strip().lower()
    if op_end == "s":
        while True:
            print("\n--- Informe o Novo Endereço ---")
            rua = input("Rua: ").strip()
            numero = input("Número: ").strip()
            complemento = input("Complemento: ").strip()
            bairro = input("Bairro: ").strip()
            municipio = input("Município: ").strip()
            estado = input("Estado: ").strip()
            cep = input("CEP: ").strip()
            novo_end = {
                "rua": rua,
                "numero": numero,
                "complemento": complemento,
                "bairro": bairro,
                "municipio": municipio,
                "estado": estado,
                "cep": cep
            }
            contato["enderecos"].append(novo_end)
            if input("Deseja adicionar outro endereço? (s/n): ").strip().lower() != 's':
                break

    # Alterar telefones
    print("\nTelefones atuais:", contato["telefones"])
    op_tel = input("Deseja (1) adicionar ou (2) remover telefones? (Enter para ignorar): ").strip()
    if op_tel == "1":
        while True:
            tel = input("Digite um novo telefone (ou Enter para encerrar): ").strip()
            if tel == "":
                break
            contato["telefones"].append(tel)
    elif op_tel == "2":
        while True:
            tel = input("Digite o telefone a remover (ou Enter para encerrar): ").strip()
            if tel == "":
                break
            if tel in contato["telefones"]:
                contato["telefones"].remove(tel)
                print("Telefone removido.")
            else:
                print("Telefone não encontrado.")

    # Alterar emails
    print("\nEmails atuais:", contato["emails"])
    op_email = input("Deseja (1) adicionar ou (2) remover emails? (Enter para ignorar): ").strip()
    if op_email == "1":
        while True:
            email = input("Digite um novo email (ou Enter para encerrar): ").strip()
            if email == "":
                break
            contato["emails"].append(email)
    elif op_email == "2":
        while True:
            email = input("Digite o email a remover (ou Enter para encerrar): ").strip()
            if email == "":
                break
            if email in contato["emails"]:
                contato["emails"].remove(email)
                print("Email removido.")
            else:
                print("Email não encontrado.")

    print("\nContato alterado com sucesso!\n")

def excluir_contato():
    buscar = input("Digite o ID do contato a excluir: ").strip()
    if not buscar.isdigit():
        print("ID inválido!\n")
        return
    cid = int(buscar)
    if cid in agenda:
        del agenda[cid]
        print("Contato excluído com sucesso!\n")
    else:
        print("Contato não encontrado!\n")

def listar_contatos():
    if agenda:
        print("\n--- Lista de Contatos ---")
        for cid, contato in agenda.items():
            print(f"ID: {cid} - Nome: {contato['nome']}")
        print("-------------------------\n")
    else:
        print("Nenhum contato cadastrado!\n")

def menu():
    while True:
        print("==== Agenda de Contatos ====")
        print("1 - Adicionar Contato")
        print("2 - Consultar Contato")
        print("3 - Alterar Contato")
        print("4 - Excluir Contato")
        print("5 - Listar Contatos")
        print("0 - Sair")
        opcao = input("Escolha uma opção: ").strip()
        
        if opcao == "1":
            adicionar_contato()
        elif opcao == "2":
            consultar_contato()
        elif opcao == "3":
            alterar_contato()
        elif opcao == "4":
            excluir_contato()
        elif opcao == "5":
            listar_contatos()
        elif opcao == "0":
            print("Encerrando o programa...")
            break
        else:
            print("Opção inválida. Tente novamente.\n")

if __name__ == "__main__":
    menu()