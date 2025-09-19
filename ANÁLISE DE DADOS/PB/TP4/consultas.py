import sqlite3
import pandas as pd
import os

def realizar_consultas(nome_banco="biblioteca.db"):
    conexao = sqlite3.connect(nome_banco)

    # 1. DataFrame: autores do livro "Piquenique na Estrada"
    df_autores_piquenique = pd.read_sql_query("""
        SELECT A.nome, A.pais_origem
        FROM Autor A
        JOIN LivroAutor LA ON A.id_autor = LA.id_autor
        JOIN Livro L ON L.id_livro = LA.id_livro
        WHERE L.titulo = 'Piquenique na Estrada'
    """, conexao)

    # 2. DataFrame: livros do autor "Philip K. Dick"
    df_livros_philip_dick = pd.read_sql_query("""
        SELECT L.titulo, L.genero
        FROM Livro L
        JOIN LivroAutor LA ON L.id_livro = LA.id_livro
        JOIN Autor A ON A.id_autor = LA.id_autor
        WHERE A.nome = 'Philip K. Dick'
    """, conexao)

    # 3. DataFrame: empréstimos atuais do usuário "Pedro Vinicius"
    df_emprestimos_pedro_vinicius = pd.read_sql_query("""
        SELECT L.titulo, E.data_emprestimo
        FROM Emprestimo E
        JOIN Usuario U ON U.id_usuario = E.id_usuario
        JOIN Livro L ON L.id_livro = E.id_livro
        WHERE U.nome = 'Pedro' AND U.sobrenome = 'Vinicius' AND E.data_devolucao IS NULL
    """, conexao)

    conexao.close()

    # Pasta para os resultados
    pasta_resultados = os.path.join(os.getcwd(), "resultados")
    os.makedirs(pasta_resultados, exist_ok=True)

    # Salvar JSONs
    df_autores_piquenique.to_json(os.path.join(pasta_resultados, "autores_piquenique.json"), orient="records", indent=4)
    df_livros_philip_dick.to_json(os.path.join(pasta_resultados, "livros_philip_dick.json"), orient="records", indent=4)
    df_emprestimos_pedro_vinicius.to_json(os.path.join(pasta_resultados, "emprestimos_pedro_vinicius.json"), orient="records", indent=4)

    # Salvar CSV
    df_autores_piquenique.to_csv(os.path.join(pasta_resultados, "autores_piquenique.csv"), index=False)
    df_livros_philip_dick.to_csv(os.path.join(pasta_resultados, "livros_philip_dick.csv"), index=False)
    df_emprestimos_pedro_vinicius.to_csv(os.path.join(pasta_resultados, "emprestimos_pedro_vinicius.csv"), index=False)

    return df_autores_piquenique, df_livros_philip_dick, df_emprestimos_pedro_vinicius

realizar_consultas()