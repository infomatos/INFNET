from datetime import datetime

# Lista global de tarefas
tarefas = []

def gerar_id():
    
    return len(tarefas) + 1

def adicionar_tarefa(descricao, prazo, urgencia):
    
    tarefa = {
        'id': gerar_id(),
        'descricao': descricao,
        'data_criacao': datetime.now().strftime('%Y-%m-%d'),
        'status': 'Pendente',
        'prazo': prazo,
        'urgencia': urgencia
    }
    tarefas.append(tarefa)
    print("Tarefa adicionada com sucesso!")

def listar_tarefas():
    
    if not tarefas:
        print("Nenhuma tarefa pendente.")
        return

    print("\nTarefas:")
    for tarefa in tarefas:
        descricao = tarefa['descricao']
        if tarefa['status'] == 'Concluída':
            # Aplicando o efeito de rasura (com formatação ANSI ou markdown)
            descricao = ''.join([f'\u0336{char}' for char in descricao])  # Rasura cada caractere da descrição
        print(f"ID: {tarefa['id']} | Descrição: {descricao} | Prazo: {tarefa['prazo']} | Urgência: {tarefa['urgencia']} | Status: {tarefa['status']}")

def marcar_concluida(tarefa_id):
    
    for tarefa in tarefas:
        if tarefa['id'] == tarefa_id:
            if tarefa['status'] == 'Pendente':
                tarefa['status'] = 'Concluída'
                print("Tarefa marcada como concluída!")
                return
            else:
                print("Tarefa já está concluída.")
                return
    print("Tarefa não encontrada.")

def remover_tarefa(tarefa_id):
    
    for tarefa in tarefas:
        if tarefa['id'] == tarefa_id:
            tarefas.remove(tarefa)
            print("Tarefa removida com sucesso!")
            return
    print("Tarefa não encontrada.")
