package org.example.ex05;

public class Resposta {
    private String respostaJSON;

    public Resposta(String respostaJSON) {
        this.respostaJSON = respostaJSON;
    }

    @Override
    public String toString() {
        return "Resposta: " + respostaJSON;
    }
}
