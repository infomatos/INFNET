namespace Event1 {
    public class Conta {
        public int Id { get; set; }
        public string Nome { get; set; }
        public double Saldo { get; set; }

        public event EventHandler AlteracaoSaldo;

        //construtor
        public Conta(int id, string nome, double saldo) { 
            Id = id;
            Nome = nome;
            Saldo = saldo;
        }

        //método 1
        public void Creditar(double valor) {
            Saldo += valor;
            if (AlteracaoSaldo == null) {
                throw new Exception("Erro: tratamento de evento");
            }
            AlteracaoSaldo.Invoke(this, EventArgs.Empty);
        }

        //método 2
        public void Debitar(double valor) {
            Saldo -= valor;
            if (AlteracaoSaldo == null) {
                throw new Exception("Erro: tratamento de evento");
            }
            AlteracaoSaldo.Invoke(this, EventArgs.Empty);
        }

        //sobreescrita
        public override string ToString() {
            return Id + " " + Nome + " " + Saldo;
        }
    }
}
