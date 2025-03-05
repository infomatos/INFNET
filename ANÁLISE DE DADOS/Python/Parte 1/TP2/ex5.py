notas = {'Ana': 8.5, 'Pedro': 6.0, 'Maria': 7.5, 'José': 5.5}
classificacao = {'Aprovado': [aluno for aluno, nota in notas.items() if nota >= 7],
                 'Reprovado': [aluno for aluno, nota in notas.items() if nota < 7]}
print(classificacao)
