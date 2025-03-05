namespace ParOuImpar
{
    internal class Program
    {
        static void Main(string[] args)
        {
            VerificarSeNumeroEParOuImpar VerificarPar = NumeroPar;
            VerificarSeNumeroEParOuImpar VerificarImpar = NumeroImpar;

            int number = 6;
            int[] numeros = {1,2,3,4,5,6,7,8,9,10};

            Console.WriteLine("Testando os métodos do Delegate:");
            if (VerificarPar(number))
            {
                Console.WriteLine($"{number} é Par.");
            } else
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

            Console.WriteLine($"\nChecando quais números do vetor [1,2,3,4,5,6,7,8,9,10] são par ou impar:");
            VerificarNumerosDoVetor(numeros,VerificarPar,VerificarImpar);
        }
        public delegate bool VerificarSeNumeroEParOuImpar(int numb);

        static bool NumeroPar(int numb)
        {
            return (numb % 2 == 0);
        }

        static bool NumeroImpar(int numb)
        {
            return (numb % 2 != 0);
        }

        // Método que verifica se os números do vetor são pares ou ímpares
        static List<int> VerificarNumerosDoVetor(int[] vetor, VerificarSeNumeroEParOuImpar NumeroPar, 
            VerificarSeNumeroEParOuImpar NumeroImpar)
        {
            List<int> resultado = new List<int>();

            foreach (int numero in vetor)
            {
                if (NumeroPar(numero))
                {
                    //resultado.Add(numero);
                    Console.WriteLine($"{numero} é par.");
                } else if (NumeroImpar(numero))
                {
                    //resultado.Add(numero);
                    Console.WriteLine($"{numero} é impar.");
                }
            }

            return resultado;
        }
    }
}
