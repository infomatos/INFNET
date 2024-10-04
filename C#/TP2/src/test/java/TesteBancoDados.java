import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

public class TesteBancoDados {

    @BeforeEach
    public void limparLog() {
        File logFile = new File("log.txt");
        if (logFile.exists()) {
            logFile.delete(); // Apaga o arquivo log.txt se ele existir
        }
    }

    @Test
    public void testarInsercaoComSucesso1(){
        StubBancoDados conexao = new StubBancoDados();
        String comandoSQL = null;
        boolean resultado = conexao.inserir("");
        assertTrue(resultado, "A chamada inserir deve retornar true.");
    }

    @Test
    public void testarTamanhoListaComandosAposInsercao() {

        StubBancoDados banco = new StubBancoDados();

        String comandoSQL = "INSERT INTO tabela_exemplo VALUES ('valor1', 'valor2')";
        banco.inserir(comandoSQL);

        assertEquals(1,banco.getListaComandos().size(),"O tamanho deve ser 1");
    }

    @Test
    public void testarInsercaoComSucesso2(){
        MockBancoDados banco =new MockBancoDados();

        String comandoSQL = "INSERT INTO tabela_exemplo VALUES ('valor1', 'valor2')";

        boolean resultado = banco.inserir(comandoSQL);
        assertTrue(resultado, "O método inserir da MockBancoDados deveria retornar true.");

        assertEquals(1, banco.getListaComandos().size(), "O tamanho da lista de comandos deveria ser 1 após a inserção.");
    }

    @Test
    public void testarInsercaoComErro2() {

        MockBancoDados banco = new MockBancoDados();

        String comandoSQLInvalido = "";

        boolean resultado = banco.inserir(comandoSQLInvalido);
        assertTrue(!resultado, "O método inserir deveria retornar false para comandoSQL inválido.");

        assertEquals(0, banco.getListaComandos().size(), "O tamanho da lista de comandos deveria ser 0 após inserção inválida.");
    }

    private int contarLinhasLog() {
        int linhas = 0;
        File logFile = new File("log.txt");

        // Verifica se o arquivo de log existe
        if (logFile.exists()) {
            try (BufferedReader reader = new BufferedReader(new FileReader(logFile))) {
                while (reader.readLine() != null) {
                    linhas++;
                }
            } catch (IOException e) {
                System.out.println("Erro ao ler o arquivo de log: " + e.getMessage());
            }
        }
        return linhas;
    }

    @Test
    public void testarInsercaoComErro() {
        // Cria uma instância da classe MockBancoDados
        MockBancoDados banco = new MockBancoDados();

        // Passa uma String vazia para o comandoSQL
        String comandoSQLVazio = "";

        // Chama o método inserir e verifica se o resultado é false
        boolean resultado = banco.inserir(comandoSQLVazio);
        assertFalse(resultado, "O método inserir deveria retornar false para um comandoSQL vazio.");
    }
}
