import sqlite3
import pandas as pd

def inserir_dados(nome_banco='biblioteca.db'):
    conn = sqlite3.connect(nome_banco)

    # Lê os DataFrames
    df_livros = pd.read_csv('dados/df_livros_formatado.csv')
    df_autores = pd.read_csv('dados/df_autores.csv')
    df_livro_autor = pd.read_csv('dados/df_livro_autor.csv')

    # Insere nas tabelas
    df_livros.to_sql('Livro', conn, if_exists='append', index=False)
    df_autores.to_sql('Autor', conn, if_exists='append', index=False)
    df_livro_autor.to_sql('LivroAutor', conn, if_exists='append', index=False)

    conn.close()
    print("✅ Dados inseridos com sucesso no banco de dados.")

if __name__ == "__main__":
    inserir_dados()
