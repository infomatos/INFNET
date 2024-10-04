import java.util.ArrayList;
import java.util.List;

public class StubBancoDados {
    private ArrayList<String> listaComandos;

    public ArrayList<String> getListaComandos() {
        return listaComandos;
    }

    public void setListaComandos(ArrayList<String> listaComandos) {
        this.listaComandos = listaComandos;
    }

    public boolean inserir (String comandoSQL){
        listaComandos.add(comandoSQL);
        return true;
    }
}
