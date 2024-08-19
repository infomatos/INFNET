using Banco.Models;
using System.Data.SqlClient;
using System.Runtime.CompilerServices;

namespace Banco
{
    internal class Program
    {
        static void Main(string[] args)
        {
            const string connectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=Banco;Integrated Security=True;";
            string sql = "SELECT * FROM contas";
            List<Conta> contas = new List<Conta>();

            using (SqlConnection sqlConn = new SqlConnection(connectionString))
            {
                try
                {
                    sqlConn.Open();
                    SqlCommand cmd = new SqlCommand(sql, sqlConn);
                    SqlDataReader dr = cmd.ExecuteReader();
                    while (dr.Read())
                    {
                        int id = Convert.ToInt32(dr["ID"]);
                        string nome = dr["Nome"].ToString();
                        double saldo = double.Parse(dr["Saldo"].ToString());
                        contas.Add(new Conta (id, nome, saldo ));
                    } //dr.Close();
                }   
                catch (SqlException ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
            foreach (Conta conta in contas)
            {
                Console.WriteLine(conta.ToString());
            }
        }
    }
}
