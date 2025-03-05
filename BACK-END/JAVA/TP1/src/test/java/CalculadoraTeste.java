
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledOnJre;
import org.junit.jupiter.api.condition.EnabledOnOs;
import org.junit.jupiter.api.condition.JRE;
import org.junit.jupiter.api.condition.OS;

import static org.junit.jupiter.api.Assertions.*;

public class CalculadoraTeste {
    @Test
    @Order(1)
    @EnabledOnOs(OS.WINDOWS)
    public void teste1_Dividir4Por2_Retorna2() {
        Calculadora calculadora = new Calculadora();
        float resultado = calculadora.dividir(4,2);
        assertEquals(2, resultado);
    }

    @Test
    public void testar_Dividir4Por2_Retorna2_ERRO() {
        Calculadora calculadora = new Calculadora();
        float resultado = calculadora.dividir(4,2);
        assertNotEquals(1, resultado);
    }

    @Test
    public void testar_DividirPorZero_LancaExcecao() {
        Calculadora calculadora = new Calculadora();
        assertThrows(ArithmeticException.class, () -> {
            calculadora.dividir(4, 0);
        });
    }

    @Test
    @Order(2)
    @EnabledOnJre(JRE.JAVA_17)
    public void teste2_Somar4Com2_Retorna6() {
        Calculadora calculadora = new Calculadora();
        float resultado = calculadora.somar(4,2);
        assertEquals(6, resultado);
    }

    @Test
    public void testar_Somar4Com2_Retorna6_ERRO() {
        Calculadora calculadora = new Calculadora();
        float resultado = calculadora.somar(4,3);
        assertNotEquals(6, resultado);
    }

    @Test
    @Order(3)
    public void teste3_Subtrair2De4_Retorna2() {
        Calculadora calculadora = new Calculadora();
        float resultado = calculadora.subtrair(4,2);
        assertEquals(2, resultado);
    }

    @Test
    public void testar_Subtrair2De4_Retorna2_ERRO() {
        Calculadora calculadora = new Calculadora();
        float resultado = calculadora.subtrair(4,1);
        assertNotEquals(2, resultado);
    }

    @Test
    @Order(4)
    public void teste4_Multiplicar4Por2_Retorna8() {
        Calculadora calculadora = new Calculadora();
        float resultado = calculadora.multiplicar(4,2);
        assertEquals(8, resultado);
    }

    //Teste com resultado acima de 4 bytes
    @Test
    public void testar_Multiplicar_Retorna_ESTOURO() {
        Calculadora calculadora = new Calculadora();
        float resultado = calculadora.multiplicar(5000000,5000000);
        assertTrue(resultado < 0, "Resultado acima de 4 bytes!");
    }

    @Test
    public void testar_Multiplicar4Por2_Retorna8_ERRO() {
        Calculadora calculadora = new Calculadora();
        float resultado = calculadora.multiplicar(4,4);
        assertNotEquals(8, resultado);
    }

    @BeforeAll
    public static void inicioDosTestes() {
        System.out.println("Inicio dos testes");
    }

    @AfterAll
    public static void fimDosTestes() {
        System.out.println("Fim dos testes");
    }

}
