package org.example.ex08;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class Hipolabs {
    public static void main(String[] args) {
        try {
            URL url = new URL("http://universities.hipolabs.com/search?country=Brazil");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            int status = connection.getResponseCode();
            if (status == 200) {
                BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String inputLine;
                StringBuffer content = new StringBuffer();

                while ((inputLine = in.readLine()) != null) {
                    content.append(inputLine);
                }
                in.close(); connection.disconnect();

                JSONArray jsonArrayResponse = new JSONArray(content.toString());
                List<Universidade> universidades = new ArrayList<Universidade>();
                for (int i = 0; i < jsonArrayResponse.length(); i++) {
                    JSONObject jsonObjectUni = jsonArrayResponse.getJSONObject(i);

                    String nome = jsonObjectUni.getString("name");
                    String urlUniver = jsonObjectUni.getJSONArray("web_pages").getString(0);

                    Universidade universidade = new Universidade(nome, urlUniver);

                    universidades.add(universidade);
                }
                for (Universidade universidade : universidades) {
                    System.out.println(universidade);
                }
            } else {
                System.out.println("Erro de conexão: " + status);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
