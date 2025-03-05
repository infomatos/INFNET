namespace Event1 {
    public class Program() { 
        public static void Main(string[] args) {
            Conta conta = new Conta(1, "Carlos", 1000);

            conta.AlteracaoSaldo += TratarAlteracaoSaldo;
            conta.AlteracaoSaldo += TratarAlteracaoSaldo2;
            conta.Creditar(100);
            conta.Debitar(100);
    }

        public static void TratarAlteracaoSaldo(object sender, EventArgs e) {
            Console.WriteLine("Saldo alterado");
        }

        public static void TratarAlteracaoSaldo2(object sender, EventArgs e) {
            Console.WriteLine("Saldo alterado 2");
        }
    }
}