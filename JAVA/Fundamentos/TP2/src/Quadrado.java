public class Quadrado {
    private float lado = 0;

    public float getLado(){
        return lado;
    }
    public void setLado(float lado) {
        if (lado != 0) {
            this.lado = lado;
        } else {
            System.out.println("Valor nulo ou igual a zero.");
        }
    }

    public float perimetro () {
        return lado * 4;
    }
    public float area () {
        return lado * lado;
    }
}
