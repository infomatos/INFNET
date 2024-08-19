using Banco.Models;
using static Banco.Utils;
using static Banco.CrudBd;

namespace Banco {
    public class Crud {

        public static void CriarConta() {

            string nome = EntrarNome();
            double saldo = EntrarSaldo();
            Incluir(nome, saldo);
        }

        public static void AlterarConta() {
            
            int id = EntrarId();
            Conta conta = ConsultarConta(id);
            if (conta == null) {
                Console.WriteLine("Erro: conta não existe");
                return;
            }
            conta.Saldo = EntrarSaldo();
            Alterar(conta);
        }

        public static void ExcluirConta() {

            int id = EntrarId();
            Conta conta = ConsultarConta(id);
            if (conta != null) {
                Excluir(id);
            }
            else {
                Console.WriteLine("Erro: conta não existe");
            }
        }

        public static void ConsultarContaId() {

            int id = EntrarId();
            Conta conta = ConsultarConta(id);
            if (conta != null) {
                Console.WriteLine(conta);
            }
            else {
                Console.WriteLine("Erro: conta não existe");
            }
        }

        public static void MostrarContas() {
            //List<Conta> contas = ConsultarTodos();
            foreach (Conta conta in ConsultarTodos()) {
                Console.WriteLine(conta);
            }
        }
    }
}
