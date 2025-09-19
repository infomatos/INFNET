import sqlite3
from importar_csv import carregar_dataframes

def inserir_dados(nome_banco="biblioteca.db"):
    autores_df, livros_df, livro_autor_df, usuarios_df, emprestimos_df = carregar_dataframes()
    conexao = sqlite3.connect(nome_banco)

    autores_df.to_sql("Autor", conexao, if_exists="append", index=False)
    livros_df.to_sql("Livro", conexao, if_exists="append", index=False)
    livro_autor_df.to_sql("LivroAutor", conexao, if_exists="append", index=False)
    usuarios_df.to_sql("Usuario", conexao, if_exists="append", index=False)
    emprestimos_df.to_sql("Emprestimo", conexao, if_exists="append", index=False)

    conexao.close()
inserir_dados()