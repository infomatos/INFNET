package controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dto.CarroDTOInput;
import dto.CarroDTOOutput;
import service.CarroService;

import static spark.Spark.*;

public class CarroController {
    private CarroService carro = new CarroService();
    private ObjectMapper mapper = new ObjectMapper();

    public void respostasRequisicoes() {
        get("/carros", (request, response) -> {
            response.type("application/json");
            response.status(200);
            String json = mapper.writeValueAsString(carro.listar());
            return json;
        });

        get("/carros/:id", (request, response) -> {
            response.type("application/json");
            String idParametro = request.params(":id");
            Long id = Long.valueOf(idParametro);
            String json = mapper.writeValueAsString(carro.buscar(Math.toIntExact(id)));
            response.status(200);
            return json;
        });

        delete("/carros/:id", (request, response) -> {
            response.type("application/json");
            String idParametro = request.params(":id");
            Long id = Long.valueOf(idParametro);
            carro.excluir(Math.toIntExact(id));
            response.status(200);
            return "Carro deletado.";
        });

        post("/carros", (request, response) -> {
            response.type("application/json");
            CarroDTOInput carroInput = mapper.readValue(request.body(), CarroDTOInput.class);
            carro.inserir(carroInput);
            response.status(201);
            return "Carro inserido com sucesso!";
        });

        put("/carros", (request, response) -> {
            response.type("application/json");
            CarroDTOOutput carroOutput = mapper.readValue(request.body(), CarroDTOOutput.class);
            carro.alterar(carroOutput.getId(), carroOutput);
            response.status(201);
            return "Carro alterado.";
        });
    }
}
