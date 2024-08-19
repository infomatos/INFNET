namespace Func
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Delegates com Func.");
        }
        public static Func<double, double, double> CalcularQuadrado = (medida1, medida2) =>
        {
            return (medida2 * medida1);
        };
        public static Func<double, double, double> CalcularRetangulo = (medida1, medida2) =>
        {
            return (medida2 * medida1);
        };
        public static Func<double, double, double> CalcularTriangulo = (medida1, medida2) =>
        {
            return (medida2 * medida1) / 2;
        };
    }
}
