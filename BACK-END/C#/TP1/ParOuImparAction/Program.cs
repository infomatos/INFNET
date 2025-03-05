namespace ParOuImparAction
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Func<int, bool> VerificarPar = NumeroPar;
            Func<int, bool> VerificarImpar = NumeroImpar;

            int number = 6;
            int[] numeros = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

            Console.WriteLine("Testando os métodos do Func Delegate:");
            if (VerificarPar(number))
            {
                Console.WriteLine($"{number} é Par.");
            }
            else
            {
                Console.WriteLine($"{number} não é par.");
            }

            if (VerificarImpar(number))
            {
                Console.WriteLine($"{number} é Impar.");
            }
            else
            {
                Console.WriteLine($"{number} não é Impar.");
            }

            Console.WriteLine($"\nChecando quais números do vetor [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] são par ou impar:");
            VerificarNumerosDoVetor(numeros, VerificarPar, VerificarImpar);
        }

        static bool NumeroPar(int numb)
        {
            return (numb % 2 == 0);
        }

        static bool NumeroImpar(int numb)
        {
            return (numb % 2 != 0);
        }

        // Delegate do tipo Func para o vetor
        static void VerificarNumerosDoVetor(int[] vetor, 
            Func<int, bool> NumeroPar, Func<int, bool> NumeroImpar)
        {
            foreach (int numero in vetor)
            {
                if (NumeroPar(numero))
                {
                    Console.WriteLine($"{numero} é par.");
                }
                else if (NumeroImpar(numero))
                {
                    Console.WriteLine($"{numero} é impar.");
                }
            }
        }
    }
}
