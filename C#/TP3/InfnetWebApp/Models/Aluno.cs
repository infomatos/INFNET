using System.ComponentModel.DataAnnotations;

namespace InfnetWebApp.Models
{
    public class Aluno
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O Nome é obrigatório")]
        [StringLength(50, MinimumLength = 4, ErrorMessage = "O Nome deve ter entre 4 e 50 caracteres")]
        [Display(Name = "Nome")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O Endereço é obrigatório")]
        [StringLength(60, MinimumLength = 10, ErrorMessage = "O Endereço deve ter entre 10 e 60 caracteres")]
        [Display(Name = "Endereço")]
        public string Endereço { get; set; }

        [Required(ErrorMessage = "O Telefone é obrigatório")]
        [Display(Name = "Telefone")]
        public string Telefone { get; set; }

        [Required(ErrorMessage = "O Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Insira um endereço de email válido")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "A Data de Nascimento é obrigatória")]
        [DataType(DataType.Date, ErrorMessage = "Insira uma data válida")]
        [Display(Name = "Data de Nascimento")]
        public DateTime DataNascimento { get; set; }
    }
}
