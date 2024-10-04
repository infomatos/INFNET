package org.example.ex07;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.util.Scanner;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONObject;

public class Agify {
    public static void main(String[] args) {
        System.out.println("Digite um nome próprio:");
        Scanner sc = new Scanner(System.in);
        String nome = sc.nextLine();

        try {
            URL url = new URL("https://api.agify.io/?name=" + nome);

            HttpURLConnection conexao = (HttpURLConnection) url.openConnection();
            conexao.setRequestMethod("GET");

            int statusResposta = conexao.getResponseCode();

            if (statusResposta == 200) {
                BufferedReader in = new BufferedReader(new InputStreamReader(conexao.getInputStream()));
                String linha;
                StringBuffer texto = new StringBuffer();

                while ((linha = in.readLine()) != null) {
                    texto.append(linha);
                } in.close(); conexao.disconnect();

                ObjectMapper mapper = new ObjectMapper();
                Pessoa pessoa = mapper.readValue(texto.toString(), Pessoa.class);

                System.out.println(pessoa.toString());
            } else {
                System.out.println("Erro de conexão: " + statusResposta);
            }
        } catch (MalformedURLException | ProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
