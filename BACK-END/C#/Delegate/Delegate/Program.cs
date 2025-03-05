namespace Delegate_Noite {
    internal class Program {
        static void Main(string[] args) {
            List<Conta> contas = CriarContas();

            Conta conta = PesquisarConta(contas, 30);
            if (conta != null ) {
                Console.WriteLine(conta);
            }
            else {
                Console.WriteLine("Erro: conta não encontrada");
            }
            Console.WriteLine();
            var listaNomes = SelecionarContasComNomeIniciandoComUmaLetra(contas, 'M');
            MostraContas(listaNomes);
            Console.WriteLine();
            var listaSaldos = SelecionarContasComSaldoMaioresQueUmValor(contas, 2000);
            MostraContas(listaSaldos);
            var contasOrdenadas = OrdenarContasPorNome(contas);
            MostraContas(contasOrdenadas);
        }

        public static List<Conta> OrdenarContasPorNome(List<Conta> contas) {

            return (List<Conta>) contas.OrderBy(conta => conta.Nome);
        }

        public static List<Conta> SelecionarContasComSaldoMaioresQueUmValor(List<Conta> contas, int valor) {

            return contas.FindAll(conta => conta.Saldo > valor);
        }


        public static List<Conta> SelecionarContasComNomeIniciandoComUmaLetra(List<Conta> contas, char letra) {

            return contas.Where(conta => conta.Nome.StartsWith(letra)).ToList();
        }

        public static Conta PesquisarConta(List<Conta> contas, int id) {

            return contas.Find(conta => conta.Id == id);
        }

        public static Conta PesquisarConta2(List<Conta> contas, int id) {

            foreach (Conta c in contas) {
                if (c.Id == id) {
                    return c;
                }
            }
            return null;
        }

        public static List<Conta> CriarContas() {
            List<Conta> contas = new List<Conta>();

            contas.Add(new Conta(1, "Carlos", 1000));
            contas.Add(new Conta(2, "Samuel", 2000));
            contas.Add(new Conta(3, "Marcus", 3000));
            contas.Add(new Conta(4, "José", 4000));
            return contas;
        }

        public static void MostraContas(List<Conta> contas) {

            /*
            foreach (Conta conta in contas) {
                Console.WriteLine(conta);
            }
            */
            contas.ForEach(conta => Console.WriteLine(conta));
        }
    }
}
