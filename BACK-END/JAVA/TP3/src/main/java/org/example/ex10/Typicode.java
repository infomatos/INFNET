package org.example.ex10;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class Typicode {
    public static void main(String[] args) {
        try {
            URL url = new URL("https://jsonplaceholder.typicode.com/todos");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            con.setRequestProperty("Accept", "application/json");
            con.setDoOutput(true);

            User user = new User(1,1,"delectus aut autem", false);

            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writeValueAsString(user);

            try (OutputStream os = con.getOutputStream()) {
                byte[] input = json.getBytes();
                os.write(input, 0, input.length);
            }

            int status = con.getResponseCode();
            if (status == 201) {
                System.out.println("Post realizado com suceso.");

            } else {
                System.out.println("Erro ao postar. " + status);
            }
            con.disconnect();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
