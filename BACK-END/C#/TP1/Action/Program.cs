namespace Action
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Delegates com Action");
        }

        public static Action<double, double> CalcularQuadrado = (medida1, medida2) =>
        {
            Console.WriteLine($"Área do quadrado: {medida1 * medida2}");
        };
        public static Action<double, double> CalcularRetangulo = (medida1, medida2) =>
        {
            Console.WriteLine($"Área do retangulo: {medida1 * medida2}");
        };
        public static Action<double, double> CalcularTriangulo = (medida1, medida2) =>
        {
            Console.WriteLine($"Área do triângulo: {(medida1 * medida2)/2}");
        };
    }
}
