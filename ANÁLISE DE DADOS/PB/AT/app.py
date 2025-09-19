from utils.operacoes import *
import sqlite3

def menu():
    while True:
        print("\n📚 MENU - SISTEMA BIBLIOTECA")
        print("1. Cadastrar novo usuário")
        print("2. Listar livros disponíveis")
        print("3. Realizar empréstimo")
        print("4. Registrar devolução")
        print("5. Ver empréstimos ativos")
        print("6. Sair")

        opcao = input("Escolha uma opção: ")

        if opcao == '1':
            cadastrar_usuario()
        elif opcao == '2':
            listar_livros_disponiveis()
        elif opcao == '3':
            realizar_emprestimo()
        elif opcao == '4':
            registrar_devolucao()
        elif opcao == '5':
            listar_emprestimos_ativos()
        elif opcao == '6':
            print("Encerrando o sistema.")
            break
        else:
            print("❌ Opção inválida!")

if __name__ == "__main__":
    menu()