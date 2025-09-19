import pandas as pd
import os

def transformar_dados():
    df_original = pd.read_csv('dados/df_livros.csv')
    df_original.columns = df_original.columns.str.strip()

    # Renomeia colunas para padrão do banco
    df_renomeado = df_original.rename(columns={
        'Título': 'titulo',
        'ISBN': 'isbn',
        'Gênero': 'genero',
        'Data de publicação': 'data_publicacao',
        'Páginas': 'num_paginas',
        'Quantidade Disponível': 'num_exemplares',
        'Autor(es)': 'autor',
        'País de Nascimento': 'pais_origem'
    })

    # Criação do df_livros
    df_livros = df_renomeado[['titulo', 'isbn', 'genero', 'data_publicacao', 'num_paginas', 'num_exemplares']]
    df_livros['id_livro'] = range(1, len(df_livros) + 1)

    # Criação do df_autores
    df_autores = df_renomeado[['autor', 'pais_origem']].drop_duplicates().rename(columns={
        'autor': 'nome',
        'pais_origem': 'pais_origem'
    })
    df_autores['id_autor'] = range(1, len(df_autores) + 1)

    # Criação do df_livro_autor
    df_livro_autor = df_renomeado[['titulo', 'autor']].merge(
        df_livros[['id_livro', 'titulo']], on='titulo'
    ).merge(
        df_autores[['id_autor', 'nome']], left_on='autor', right_on='nome'
    )[['id_livro', 'id_autor']]

    # Salvar arquivos
    os.makedirs("dados", exist_ok=True)
    df_livros.to_csv("dados/df_livros_formatado.csv", index=False)
    df_autores.to_csv("dados/df_autores.csv", index=False)
    df_livro_autor.to_csv("dados/df_livro_autor.csv", index=False)

    print("✅ CSVs gerados com sucesso:")
    print("- df_livros_formatado.csv")
    print("- df_autores.csv")
    print("- df_livro_autor.csv")

if __name__ == "__main__":
    transformar_dados()
