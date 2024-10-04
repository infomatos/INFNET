package service;

import dto.CarroDTOInput;
import dto.CarroDTOOutput;
import model.Carro;
import org.modelmapper.ModelMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CarroService {

    private List<Carro> carros = new ArrayList<>();
    private ModelMapper mapper = new ModelMapper();

    //================CRUD======================
    public List<CarroDTOOutput> listar() {
        return carros.stream().map(carro -> mapper.map(carro, CarroDTOOutput.class)).collect(Collectors.toList());
    }
    public void inserir(CarroDTOInput carro) {
        Carro novoCarro = mapper.map(carro, Carro.class);
        carros.add(novoCarro);
    }

    public Carro buscar(int id) {
        for (CarroDTOOutput carro : listar()) {
            if (carro.getId() == id) {
                Carro carroEncontrado = mapper.map(carro, Carro.class);
                return carroEncontrado;
            }
        }
        return null;
    }
    public boolean alterar(int id, CarroDTOOutput inputCarro) {

        for (Carro carro : carros) {
            if (carro.getId() == id) {

                Carro carroAtualizado = mapper.map(inputCarro, Carro.class);

                carro.setModelo(carroAtualizado.getModelo());
                carro.setPlaca(carroAtualizado.getPlaca());
                carro.setChassi(carroAtualizado.getChassi());
                return true;
            }
        }
        return false;
    }
    public void excluir(int id) {
        carros.removeIf(carro -> carro.getId() == id);
    }
}
