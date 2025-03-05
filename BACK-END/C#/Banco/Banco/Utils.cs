namespace Banco {
    public class Utils {

        public static int EntrarInteiro() {
            int num = 0;

            do {
                try {
                    Console.Write("Entre com o id da conta: ");
                    num = int.Parse(Console.ReadLine());
                    break;
                } 
                catch (FormatException) {
                    Console.WriteLine("Erro: valor inválido");
                }
            } while (true);
            return num;
        }

        public static int EntrarId() {

            int id = EntrarInteiro();
            return id;
        }

        public static string EntrarNome() {
            Console.Write("Entre com o nome: ");
            string nome = Console.ReadLine();
            return nome;
        }

        public static double EntrarSaldo() {
            Console.Write("Entre com o saldo: ");
            double saldo = double.Parse(Console.ReadLine());
            return saldo;
        }
    }
}
