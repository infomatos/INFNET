from datetime import datetime

tarefas = []

def gerar_id():
    """
    Gera um ID único para cada tarefa.
    
    Retorno:
    int: ID da nova tarefa.
    """
    return len(tarefas) + 1

def adicionar_tarefa(descricao, prazo, urgencia):
    """
    Adiciona uma nova tarefa à lista de tarefas pendentes.
    
    Parâmetros:
    descricao (str): Descrição da tarefa.
    prazo (str): Data limite para a conclusão da tarefa no formato AAAA-MM-DD.
    urgencia (str): Nível de urgência da tarefa (e.g., 'Alta', 'Média', 'Baixa').
    
    Retorno:
    Nenhum.
    """
    tarefa = {
        'id': gerar_id(),
        'descricao': descricao,
        'data_criacao': datetime.now().strftime('%d/%m'),
        'status': 'PENDENTE',
        'prazo': prazo,
        'urgencia': urgencia
    }
    tarefas.append(tarefa)
    print("Tarefa adicionada com sucesso!")

def listar_tarefas():
    """
    Exibe todas as tarefas na lista, enumerando-as e rasurando as concluídas.
    
    Retorno:
    Nenhum.
    """
    if not tarefas:
        print("Nenhuma tarefa pendente.")
        return

    print("\nTarefas:")
    for tarefa in tarefas:
        descricao = tarefa['descricao']
        prazo = tarefa['prazo']
        urgencia = tarefa['urgencia']
        if tarefa['status'] == 'CONCLUIDA':
            descricao = ''.join([f'\u0336{char}' for char in descricao])
            prazo = ''.join([f'\u0336{char}' for char in prazo])
            urgencia = ''.join([f'\u0336{char}' for char in urgencia])
        print(f"ID: {tarefa['id']} | {descricao} | Prazo: {prazo} | Urgência: {urgencia} | Status: {tarefa['status']}")

def marcar_concluida(tarefa_id):
    """
    Marca uma tarefa específica como concluída.
    
    Parâmetros:
    tarefa_id (int): ID da tarefa a ser marcada como concluída.
    
    Retorno:
    Nenhum.
    """
    for tarefa in tarefas:
        if tarefa['id'] == tarefa_id:
            if tarefa['status'] == 'PENDENTE':
                tarefa['status'] = 'CONCLUIDA'
                print("Tarefa marcada como concluída!")
                return
            else:
                print("Tarefa já está concluída.")
                return
    print("Tarefa não encontrada.")

def remover_tarefa(tarefa_id):
    """
    Remove uma tarefa da lista.
    
    Parâmetros:
    tarefa_id (int): ID da tarefa a ser removida.
    
    Retorno:
    Nenhum.
    """
    for tarefa in tarefas:
        if tarefa['id'] == tarefa_id:
            tarefas.remove(tarefa)
            print("Tarefa removida com sucesso!")
            return
    print("Tarefa não encontrada.")
