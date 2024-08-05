public class Circulo {
    private double raio = 0;
    private double pi = 3.1415;

    public double getRaio() {
        return raio;
    }
    public void setRaio(double raio) {
        if (raio != 0) {
            this.raio = raio;
        } else {
            System.out.println("Valor nulo ou igual a zero.");
        }
    }

    public double circunferencia() {
        return (2 * pi) * raio;
    }
    public double area() {
        return pi * Math.pow(2,raio);
    }
}
