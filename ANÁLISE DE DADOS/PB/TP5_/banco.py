import sqlite3

def criar_banco(nome_banco="biblioteca.db"):
    conexao = sqlite3.connect(nome_banco)
    cursor = conexao.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS Livro (
            id_livro INTEGER PRIMARY KEY,
            titulo TEXT NOT NULL,
            isbn TEXT NOT NULL UNIQUE,
            genero TEXT NOT NULL,
            data_publicacao TEXT NOT NULL,
            num_paginas INTEGER NOT NULL,
            num_exemplares INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Autor (
            id_autor INTEGER PRIMARY KEY,
            nome TEXT NOT NULL,
            pais_origem TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS LivroAutor (
            id_livro INTEGER NOT NULL,
            id_autor INTEGER NOT NULL,
            PRIMARY KEY (id_livro, id_autor),
            FOREIGN KEY (id_livro) REFERENCES Livro(id_livro),
            FOREIGN KEY (id_autor) REFERENCES Autor(id_autor)
        );
        
    """)

    conexao.commit()
    conexao.close()
    print(f"✅ Banco '{nome_banco}' criado com sucesso!")

if __name__ == "__main__":
    criar_banco()

# atualização do script para criar a tabela de registro de falhas durante o scrapig
def criar_tabela_erroScraping():

    conexao = sqlite3.connect('biblioteca.db')
    cursor = conexao.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ErrosScraping (
            id_erro INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT,
            erro TEXT,
            data_ocorrencia TEXT
            );
    """)
    conexao.commit()
    conexao.close()