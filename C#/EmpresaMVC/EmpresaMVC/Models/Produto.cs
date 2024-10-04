using System.ComponentModel.DataAnnotations;

namespace EmpresaMVC.Models
{
    public class Produto
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "O campo Nome é obrigatório")]
        [Display(Name = "Nome do Produto")]
        [StringLength(20, MinimumLength =4, ErrorMessage = "O nome deve ter entre 4 e 20 caracteres.")]
        public string Nome { get; set; }
        [Required(ErrorMessage = "Insira uma descrição para o produto.")]
        [Display(Name = "Descrição")]
        [StringLength(50, MinimumLength =10, ErrorMessage = "A descrição deve ter entre 10 e 50 caracteres.")]
        public string Descricao { get; set; }
        [Required(ErrorMessage = "Por favor, insira o valor do produto.")]
        [Display(Name = "Preço")]

        public double Preco {  get; set; }
    }
}
