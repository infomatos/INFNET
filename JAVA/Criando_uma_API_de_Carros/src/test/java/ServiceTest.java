import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.gson.JsonArray;
import dto.CarroDTOInput;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import service.CarroService;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import static org.junit.Assert.assertEquals;
import java.util.Random;
import org.json.JSONException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class ServiceTest {

    @Test
    public void validarInsercao() {

            CarroService carro = new CarroService();
            CarroDTOInput carroInput = new CarroDTOInput();

            carroInput.setId(12);
            carroInput.setModelo("Kicks SL");
            carroInput.setPlaca("KQR-2325");
            carroInput.setChassi("AU7129NVT0032");

            carro.inserir(carroInput);
            assertEquals(1,carro.listar().size());
    }

    @Test
    public void validarListagem() throws IOException {
        URL url = new URL("http://localhost:4567/carros");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        connection.setRequestMethod("GET");
        ObjectMapper mapper = new ObjectMapper();
        int responseCode = connection.getResponseCode();

        assertEquals(200, responseCode);
        connection.disconnect();
    }

    @Test
    public void validarInsercaoDeCarro() throws IOException, JSONException{
        try {
            JsonArray arrayDeCarros = new JsonArray();

            JSONObject carro = new JSONObject();
            carro.put("id", 11);
            carro.put("modelo", "Chevet");
            carro.put("placa","LSJ-5358");
            String chassi = "LKU33" + new Random().nextInt(1000000);
            carro.put("chassi", chassi);

            JSONObject carro2 = new JSONObject();
            carro2.put("id", 9);
            carro2.put("modelo", "Corvet");
            carro2.put("placa","QYH-7685");
            chassi = "LKU33" + new Random().nextInt(1000000);
            carro2.put("chassi", chassi);

            arrayDeCarros.add(carro.toString());
            arrayDeCarros.add(carro2.toString());
            String json = arrayDeCarros.get(1).getAsString();

            URL urlObj = new URL("http://localhost:4567/carros");
            HttpURLConnection conexao = (HttpURLConnection)urlObj.openConnection();
            conexao.setRequestProperty("Accept", "application/json");
            conexao.setDoOutput(true);
            conexao.setRequestMethod("POST");


            System.out.println(json);
            conexao.getOutputStream().write(json.getBytes());
            System.out.println(conexao.getResponseCode());

            BufferedReader in = new BufferedReader(new InputStreamReader(conexao.getInputStream()));
            StringBuffer response = new StringBuffer();
            String inputLine;

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            } in .close();

            System.out.println(response.toString());
            int responseCode = conexao.getResponseCode();

            assertEquals(201, responseCode);

            conexao.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void validarInsercaoDeCarroMapper() throws IOException{
        try {
            URL urlObj = new URL("http://localhost:4567/carros");
            HttpURLConnection conexao = (HttpURLConnection)urlObj.openConnection();
            conexao.setRequestProperty("Accept", "application/json");
            conexao.setDoOutput(true);
            conexao.setRequestMethod("POST");

            ObjectMapper mapper = new ObjectMapper();
            ObjectNode carro = mapper.createObjectNode();
            carro.put("id", 14);
            carro.put("modelo", "BMW 320i");
            carro.put("placa", "KVI-7866");
            carro.put("chassi", "LSJ5358VH728");

            OutputStream os = conexao.getOutputStream();
            String jsonCarro = mapper.writeValueAsString(carro);
            os.write(jsonCarro.getBytes());
            os.flush();
            os.close();
            System.out.println(jsonCarro);

            BufferedReader in = new BufferedReader(new InputStreamReader(conexao.getInputStream()));
            StringBuffer response = new StringBuffer();
            String inputLine;

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            } in .close();

            System.out.println(response.toString());

            int responseCode = conexao.getResponseCode();

            assertEquals(201, responseCode);

            conexao.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

