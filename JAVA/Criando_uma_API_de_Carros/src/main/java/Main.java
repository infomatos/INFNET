import controller.CarroController;
import dto.CarroDTOInput;
import model.Carro;
import service.CarroService;

public class Main {
    public static void main(String[] args) {

        CarroController carro = new CarroController();
        carro.respostasRequisicoes();
    }
}
