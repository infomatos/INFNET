package org.example.ex09;


import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class Typicode {
    public static void main(String[] args) {
        try {
            URL url = new URL("https://jsonplaceholder.typicode.com/todos");

            HttpURLConnection conexao = (HttpURLConnection)url.openConnection();

            conexao.setRequestMethod("POST");

            conexao.setRequestProperty("Content-Type", "application/json");
            conexao.setRequestProperty("Accept", "application/json");
            conexao.setDoOutput(true);

            String jsonInputString = "{"
                    + "\"userId\": 1,"
                    + "\"id\": 1,"
                    + "\"title\": \"delectus aut autem\","
                    + "\"completed\": false"
                    + "}";

            try (OutputStream os = conexao.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("UTF-8");
                os.write(input, 0, input.length);
            }

            int status = conexao.getResponseCode();

            if (status == 201) {
                System.out.println("POST efetuado com sucesso.");
            } else {
                System.out.println("Erro de conexão: " + status);
            }
            conexao.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
