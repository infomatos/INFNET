using System;
using System.Diagnostics;
namespace DelegateEvent
{
    internal class Program
    {
        static void Main(string[] args)
        {
            ControleRemoto controleRemoto = new ControleRemoto(10);
            controleRemoto.VolumeAlterado += ControleRemoto_VolumeAlterado;

            Console.WriteLine("Aumentando o volume:");
            controleRemoto.AumentarVolume();

            Console.WriteLine("Diminuindo o volume:");
            controleRemoto.DiminuirVolume();

            Console.WriteLine("Diminuindo o volume novamente:");
            controleRemoto.DiminuirVolume();
        }
        public static void ControleRemoto_VolumeAlterado(object sender, EventArgs e)
            {
                ControleRemoto controle = (ControleRemoto)sender;
                Console.WriteLine($"Volume alterado para: {controle.Volume}");
            }
        }
}