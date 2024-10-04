package org.example.ex05;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class ChuckNorris {
    public static void main(String[] args) throws IOException {

        URL url = new URL("https://api.chucknorris.io/jokes/random");
        HttpURLConnection conexao = (HttpURLConnection) url.openConnection();
        conexao.setRequestMethod("GET");
        int statusResposta = conexao.getResponseCode();

        if (statusResposta == 200) {

            BufferedReader in = new BufferedReader(new InputStreamReader(conexao.getInputStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();

            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            } in.close(); conexao.disconnect();

            Resposta resp = new Resposta(content.toString());
            System.out.println(resp.toString());
        } else {
            System.out.println("Erro de conexão: " + statusResposta);
        }
    }
}