namespace Delegate2 {
    internal class Program {
        static void Main(string[] args) {
            //Console.WriteLine("Soma = " + Somar(2, 2));
            //Somar3(2, 2);
            Somar4(2, 2);
        }

        // Delegate com Action
        public static Action<double, double> Somar4 = (op1, op2) => {
            double result = op1 + op2;
            Console.WriteLine("Soma = " + result);
        };
        
        public static void Somar3(double op1, double op2) {
            double result = op1 + op2;
            Console.WriteLine("Soma = " + result);
        }

        public static double Somar1(double op1, double op2) {
            double result = op1 + op2;
            return result;
        }

        // Delegate com Func
        public static Func<double, double, double> Somar2 = (op1, op2) => {
            double result = op1 + op2;
            return result;
        };

        // Delegate com Func
        public static Func<double, double, double> Somar = (op1, op2) => op1 + op2;
    }
}
