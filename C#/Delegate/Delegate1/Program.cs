namespace Delegate1 {
    internal class Program {
        static void Main(string[] args) {
            // Delegate é uma variável que aponta para um método
            Calcular calcular = Somar;
            Console.WriteLine("Soma = " + calcular(2, 3));

            calcular = Subtrair;
            Console.WriteLine("Subtração = " + calcular(2, 3));

            calcular = Multiplicar;
            Console.WriteLine("Multiplicação = " + calcular(2, 3));
        }

        public delegate double Calcular(double op1, double op2);

        public static double Somar(double op1, double op2) {
            return op1 + op2;
        }

        public static double Subtrair(double op1, double op2) {
            return op1 - op2;
        }

        public static double Multiplicar(double op1, double op2) {
            return op1 * op2;
        }
    }
}
