using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Banco.Models
{
    internal class Conta
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public double Saldo { get; set; }

        public Conta(int id, string nome, double saldo) {
            Id = id;
            Nome = nome;
            Saldo = saldo;
        }

        public Conta(){}

        public void Creditar(double valor)
        {
            Saldo += valor;
        }

        public void Debitar(double valor)
        {
            Saldo -= valor;
        }

        public override string ToString()
        {
            return "ID:" + Id + "| " + Nome + "\nSaldo: R$" + Saldo;
        }
    }
}
