import sqlite3
from datetime import datetime

# 📌 Cadastrar novo usuário
def cadastrar_usuario():
    conn = sqlite3.connect('biblioteca.db')
    cursor = conn.cursor()

    nome = input("Nome do usuário: ").strip()
    sobrenome = input("Sobrenome do usuário: ").strip()
    data_nascimento = input("Data de nascimento (YYYY-MM-DD): ").strip()

    try:
        cursor.execute("""
            INSERT INTO Usuario (nome, sobrenome, data_nascimento)
            VALUES (?, ?, ?)
        """, (nome, sobrenome, data_nascimento))

        conn.commit()
        print("✅ Usuário cadastrado com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao cadastrar usuário: {e}")
    finally:
        conn.close()


# 📌 Listar livros disponíveis
def listar_livros_disponiveis():
    conn = sqlite3.connect('biblioteca.db')
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id_livro, titulo, num_exemplares
        FROM Livro
        WHERE num_exemplares > 0
    """)
    livros = cursor.fetchall()

    print("\n📚 Livros disponíveis:")
    for livro in livros:
        print(f"ID: {livro[0]} | Título: {livro[1]} | Exemplares: {livro[2]}")

    conn.close()


# 📌 Realizar empréstimo
def realizar_emprestimo():
    conn = sqlite3.connect('biblioteca.db')
    cursor = conn.cursor()

    id_usuario = input("ID do usuário: ").strip()
    id_livro = input("ID do livro: ").strip()

    # Verifica limite de 5 livros
    cursor.execute("""
        SELECT COUNT(*) FROM Emprestimo 
        WHERE id_usuario = ? AND data_devolucao IS NULL
    """, (id_usuario,))
    emprestimos_ativos = cursor.fetchone()[0]

    if emprestimos_ativos >= 5:
        print("❌ Usuário já possui 5 livros emprestados.")
        conn.close()
        return

    # Verifica disponibilidade do livro
    cursor.execute("SELECT num_exemplares FROM Livro WHERE id_livro = ?", (id_livro,))
    row = cursor.fetchone()

    if not row:
        print("❌ Livro não encontrado.")
        conn.close()
        return

    if row[0] <= 0:
        print("❌ Livro indisponível para empréstimo.")
        conn.close()
        return

    # Registra empréstimo
    data = datetime.now().strftime('%Y-%m-%d')
    cursor.execute("""
        INSERT INTO Emprestimo (id_usuario, id_livro, data_emprestimo, data_devolucao)
        VALUES (?, ?, ?, NULL)
    """, (id_usuario, id_livro, data))

    # Atualiza disponibilidade do livro
    cursor.execute("""
        UPDATE Livro SET num_exemplares = num_exemplares - 1 WHERE id_livro = ?
    """, (id_livro,))

    conn.commit()
    conn.close()
    print("✅ Empréstimo realizado com sucesso!")


# 📌 Registrar devolução
def registrar_devolucao():
    conn = sqlite3.connect('biblioteca.db')
    cursor = conn.cursor()

    id_usuario = input("ID do usuário: ").strip()
    id_livro = input("ID do livro: ").strip()

    # Verifica se o empréstimo existe e está ativo
    cursor.execute("""
        SELECT id_emprestimo FROM Emprestimo 
        WHERE id_usuario = ? AND id_livro = ? AND data_devolucao IS NULL
    """, (id_usuario, id_livro))
    emprestimo = cursor.fetchone()

    if not emprestimo:
        print("❌ Nenhum empréstimo ativo encontrado para esse usuário e livro.")
        conn.close()
        return

    # Atualiza data de devolução
    data = datetime.now().strftime('%Y-%m-%d')
    cursor.execute("""
        UPDATE Emprestimo SET data_devolucao = ? WHERE id_emprestimo = ?
    """, (data, emprestimo[0]))

    # Devolve o exemplar ao acervo
    cursor.execute("""
        UPDATE Livro SET num_exemplares = num_exemplares + 1 WHERE id_livro = ?
    """, (id_livro,))

    conn.commit()
    conn.close()
    print("✅ Devolução registrada com sucesso.")


# 📌 Listar empréstimos ativos
def listar_emprestimos_ativos():
    conn = sqlite3.connect('biblioteca.db')
    cursor = conn.cursor()

    cursor.execute("""
        SELECT E.id_emprestimo, U.nome || ' ' || U.sobrenome, L.titulo, E.data_emprestimo
        FROM Emprestimo E
        JOIN Usuario U ON E.id_usuario = U.id_usuario
        JOIN Livro L ON E.id_livro = L.id_livro
        WHERE E.data_devolucao IS NULL
    """)
    emprestimos = cursor.fetchall()

    if not emprestimos:
        print("📭 Nenhum empréstimo ativo no momento.")
    else:
        print("\n📋 Empréstimos ativos:")
        for emp in emprestimos:
            print(f"ID: {emp[0]} | Usuário: {emp[1]} | Livro: {emp[2]} | Desde: {emp[3]}")

    conn.close()
