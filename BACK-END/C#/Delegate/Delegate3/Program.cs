namespace Delegate3 {
    internal class Program {
        static void Main(string[] args) {
            int[] vetor = { 1, 2, 3 };

            //vetor = ElevarQuadrado(vetor);
            //vetor = ElevarCubo(vetor);
            //vetor = AlterarVetor(vetor, Quadrado);
            //vetor = AlterarVetor(vetor, Cubo);
            vetor = AlterarVetor(vetor, Cubo);
            MostrarVetor(vetor);
        }

        public static Func<int, int> Quadrado = num => num * num;

        public static Func<int, int> Cubo = num => num * num * num;

        //public delegate int AlterarNumero(int num);

        //public static int Quadrado2(int num) => num * num;

        //public static int Cubo2(int num) => num * num * num;

        public static int[] AlterarVetor(int[] vetor, Func<int, int> alterarNumero) {

            for (int i = 0; i < vetor.Length; i++) {
                vetor[i] = alterarNumero(vetor[i]);
            }
            return vetor;
        }

        /*
        public static int[] AlterarVetor(int[] vetor, AlterarNumero alterarNumero) {

            for (int i = 0; i < vetor.Length; i++) {
                vetor[i] = alterarNumero(vetor[i]);
            }
            return vetor;
        }

        
        public static int[] ElevarQuadrado(int[] vetor) {

            for (int i = 0; i < vetor.Length; i++) {
                vetor[i] = vetor[i] * vetor[i];
            }
            return vetor;
        }

        public static int[] ElevarCubo(int[] vetor) {

            for (int i = 0; i < vetor.Length; i++) {
                vetor[i] = vetor[i] * vetor[i] * vetor[i];
            }
            return vetor;
        }
        */

        public static void MostrarVetor(int[] vetor) {

            foreach (var item in vetor) {
                Console.Write(item + " ");
            }
        }
    }
}
