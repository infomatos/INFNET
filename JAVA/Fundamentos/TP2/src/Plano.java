public class Plano {
    private float coordenadaCentroX = 4;
    private float coordenadaCentroY = 3;

    public double calcularDistancia () {
        float x = 8;
        float y = 6;
        return Math.sqrt(Math.pow(2,x-coordenadaCentroX) + ((y-coordenadaCentroY) * (y-coordenadaCentroY)));

    }
}
