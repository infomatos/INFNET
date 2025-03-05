using System.Security.Cryptography.X509Certificates;

namespace TP1
{
    internal class Program
    {
        static void Main(string[] args)
        {
            CalcularArea calcularArea = CalcularAreaQuadrado;
            Console.WriteLine($"Quadrado: {calcularArea}");
            calcularArea = CalcularAreaRetangulo;
            Console.WriteLine($"Retângulo: {calcularArea}");
            calcularArea = CalcularAreaTriangulo;
            Console.WriteLine($"Triangulo: {calcularArea}");
        }

        public delegate double CalcularArea(double medida1, double medida2);

        //métodos de calculo para cada área
        static double CalcularAreaQuadrado(double largura, double altura)
        {
            return largura * altura;
        }
        static double CalcularAreaRetangulo(double largura, double altura)
        {
            return largura * altura;
        }
        static double CalcularAreaTriangulo(double largura, double altura)
        {
            return (largura * altura) / 2;
        }

    }
}
