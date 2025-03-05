import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TesteFatorial {
    @Test
    public void TesteFatorial() {
        Fatorial fat = new Fatorial();
        int resultado = fat.calcular(5);
        assertEquals(120,resultado);
    }
}