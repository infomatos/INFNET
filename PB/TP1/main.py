from tarefas import adicionar_tarefa, listar_tarefas, marcar_concluida, remover_tarefa

def menu():
    
    while True:
        print("\n1. Adicionar Tarefa")
        print("2. Listar Tarefas Pendentes")
        print("3. Marcar Tarefa como Concluída")
        print("4. Remover Tarefa")
        print("5. Sair")
        
        escolha = input("Escolha uma opção: ")
        
        if escolha == '1':
            descricao = input("Descrição da Tarefa: ")
            prazo = input("Prazo (AAAA-MM-DD): ")
            urgencia = input("Urgência (Alta, Média, Baixa): ")
            adicionar_tarefa(descricao, prazo, urgencia)
        
        elif escolha == '2':
            listar_tarefas()
        
        elif escolha == '3':
            try:
                tarefa_id = int(input("ID da Tarefa a Marcar como Concluída: "))
                marcar_concluida(tarefa_id)
            except ValueError:
                print("ID inválido.")
        
        elif escolha == '4':
            try:
                tarefa_id = int(input("ID da Tarefa a Remover: "))
                remover_tarefa(tarefa_id)
            except ValueError:
                print("ID inválido.")
        
        elif escolha == '5':
            print("Encerrando o sistema de gestão de tarefas.")
            break
        else:
            print("Opção inválida, tente novamente.")

# Executa o programa
if __name__ == "__main__":
    menu()