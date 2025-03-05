using Banco.Models;
using System;
using System.Data.SqlClient;

namespace Banco {
    public class CrudBd {
        const string connectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=Banco;Integrated Security=True;";

        public static void Incluir(string nome, double saldo) {
            string sql = "insert into contas (nome, saldo) values (@nome, @saldo)";

            using (SqlConnection sqlConn = new SqlConnection(connectionString)) {
                try {
                    sqlConn.Open();
                    SqlCommand cmd = new SqlCommand(sql, sqlConn);
                    cmd.Parameters.Add(new SqlParameter("@nome", nome));
                    cmd.Parameters.Add(new SqlParameter("@saldo", saldo));
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException ex) {
                    Console.WriteLine(ex.Message);
                }
            }
        }

        public static void Alterar(Conta conta) {
            string sql = "update contas set saldo = @saldo where id = @id";

            using (SqlConnection sqlConn = new SqlConnection(connectionString)) {

                try {
                    sqlConn.Open();
                    SqlCommand cmd = new SqlCommand(sql, sqlConn);
                    cmd.Parameters.Add(new SqlParameter("@id", conta.Id));
                    cmd.Parameters.Add(new SqlParameter("@saldo", conta.Saldo));
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException ex) {
                    Console.WriteLine(ex.Message);
                }
            }
        }

        public static void Excluir(int num) {
            string sql = "DELETE FROM contas WHERE id = @id";

            using (SqlConnection sqlConn = new SqlConnection(connectionString)) {
                try {
                    sqlConn.Open();
                    SqlCommand cmd = new SqlCommand(sql, sqlConn);
                    cmd.Parameters.Add(new SqlParameter("@id", num));
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException ex) {
                    Console.WriteLine(ex.Message);
                }
            }
        }

        public static Conta ConsultarConta(int num) {
            string sql = "SELECT * FROM Contas WHERE id = @id";
            Conta conta = null;

            using (SqlConnection sqlConn = new SqlConnection(connectionString)) {
                try {
                    sqlConn.Open();
                    SqlCommand cmd = new SqlCommand(sql, sqlConn);
                    cmd.Parameters.Add(new SqlParameter("@id", num));
                    SqlDataReader dr = cmd.ExecuteReader();
                    if (dr.Read()) {
                        int id = int.Parse(dr["Id"].ToString());
                        string nome = dr["Nome"].ToString();
                        double saldo = double.Parse(dr["Saldo"].ToString());
                        conta = new Conta(id, nome, saldo);
                    }
                }
                catch (SqlException ex) {
                    Console.WriteLine(ex.Message);
                }
                return conta;
            }
        }

        public static List<Conta> ConsultarTodos() {
            string sql = "SELECT * FROM contas";
            List<Conta> contas = new List<Conta>();

            using (SqlConnection sqlConn = new SqlConnection(connectionString)) {
                try {
                    sqlConn.Open();
                    SqlCommand cmd = new SqlCommand(sql, sqlConn);
                    SqlDataReader dr = cmd.ExecuteReader();
                    while (dr.Read()) {
                        int id = int.Parse(dr["Id"].ToString());
                        string nome = dr["Nome"].ToString();
                        double saldo = double.Parse(dr["Saldo"].ToString());
                        contas.Add(new Conta(id, nome, saldo));
                    }
                    //dr.Close();
                }
                catch (SqlException ex) {
                    Console.WriteLine(ex.Message);
                }
            }
            return contas;
        }
    }
}
