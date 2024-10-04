

import org.example.ex08.Hipolabs;
import org.junit.jupiter.api.Test;

import java.net.HttpURLConnection;
import java.net.URL;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TesteUnitario {

    @Test
    public void testGetUniversidades() {

        Hipolabs request = new Hipolabs();

        int status = 0;
        try {
            URL url = new URL("http://universities.hipolabs.com/search?country=Brazil");

            HttpURLConnection con = (HttpURLConnection) url.openConnection();

            con.setRequestMethod("GET");

            status = con.getResponseCode();

            con.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(status);

        assertEquals(200, status, "O código de status da requisição deveria ser 200");
    }
}
