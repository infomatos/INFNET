notas_turma = {}
while True:
    nome = input("Digite o nome do aluno (ou 'fim' para terminar): ")
    if nome.lower() == 'fim':
        break
    nota = float(input(f"Digite a nota de {nome}: "))
    notas_turma[nome] = nota
print("Notas dos alunos:", notas_turma)
