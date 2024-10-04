import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;

public class MockBancoDados extends StubBancoDados{

    @Override
    public boolean inserir(String comandoSQL) {
        if (comandoSQL == null || comandoSQL.equals("")||comandoSQL.isEmpty()) {
            return false;
        }
        boolean resultado = super.inserir(comandoSQL);

        if (resultado) {
            registrarAcaoNoLog("inserir");
        }
        return resultado;
    }

    private void registrarAcaoNoLog(String acao) {
        try (FileWriter writer = new FileWriter("log.txt", true)) {
            writer.write("Ação: " + acao + " | Data e Hora: " + LocalDateTime.now() + "\n");
        } catch (IOException e) {
            System.out.println("Erro ao escrever no arquivo de log: " + e.getMessage());
        }
    }
}
