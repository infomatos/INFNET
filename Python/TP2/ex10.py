alunos = [{'nome': 'Ana', 'nota': 8.5}, {'nome': 'Pedro', 'nota': 6.0}, 
          {'nome': 'Maria', 'nota': 7.5}, {'nome': 'José', 'nota': 5.5}]
for i in range(len(alunos)):
    for j in range(i + 1, len(alunos)):
        if alunos[i]['nota'] < alunos[j]['nota']:
            alunos[i], alunos[j] = alunos[j], alunos[i]
print("Lista de alunos ordenada pela maior nota:", alunos)
