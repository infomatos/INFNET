import sqlite3

def criar_banco(nome_banco="biblioteca.db"):
    conexao = sqlite3.connect(nome_banco)
    cursor = conexao.cursor()

    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS Autor (
        id_autor INTEGER PRIMARY KEY,
        nome TEXT NOT NULL,
        pais_origem TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Livro (
        id_livro INTEGER PRIMARY KEY,
        titulo TEXT NOT NULL,
        isbn TEXT NOT NULL UNIQUE,
        genero TEXT NOT NULL,
        data_publicacao DATE NOT NULL,
        qtd_paginas INTEGER NOT NULL,
        disponibilidade INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS LivroAutor (
        id_livro INTEGER,
        id_autor INTEGER,
        PRIMARY KEY (id_livro, id_autor),
        FOREIGN KEY (id_livro) REFERENCES Livro(id_livro),
        FOREIGN KEY (id_autor) REFERENCES Autor(id_autor)
    );

    CREATE TABLE IF NOT EXISTS Usuario (
        id_usuario INTEGER PRIMARY KEY,
        nome TEXT NOT NULL,
        sobrenome TEXT NOT NULL,
        data_nascimento DATE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Emprestimo (
        id_emprestimo INTEGER PRIMARY KEY,
        id_usuario INTEGER NOT NULL,
        id_livro INTEGER NOT NULL,
        data_emprestimo DATE NOT NULL,
        data_devolucao DATE,
        FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
        FOREIGN KEY (id_livro) REFERENCES Livro(id_livro)
    );
    """)
    
    conexao.commit()
    conexao.close()
criar_banco()