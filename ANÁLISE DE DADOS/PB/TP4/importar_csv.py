import pandas as pd
import os

def carregar_dataframes():
    pasta_dados = os.path.join(os.getcwd(), "dados")
    
    autores_df = pd.read_csv(os.path.join(pasta_dados, "autores.csv"))
    livros_df = pd.read_csv(os.path.join(pasta_dados, "livros.csv"))
    livro_autor_df = pd.read_csv(os.path.join(pasta_dados, "livros_autores.csv"))
    usuarios_df = pd.read_csv(os.path.join(pasta_dados, "usuarios.csv"))
    emprestimos_df = pd.read_csv(os.path.join(pasta_dados, "emprestimos.csv"))

    return autores_df, livros_df, livro_autor_df, usuarios_df, emprestimos_df
