import java.util.Scanner;

public class Principal {
    public static void main(String[] args) {


        Quadrado Q1 = new Quadrado();
        Circulo C1 = new Circulo();

        Scanner ler = new Scanner(System.in);

        System.out.print("Informe o cumprimento de um dos lados do quadrado: ");
        Q1.setLado(ler.nextFloat());

        if (Q1.getLado() >= 20) {
            System.out.println("Área deste quadrado: "+ Q1.area());
            System.out.println("Perímetro: " + Q1.perimetro());
        }

        System.out.println("\n");
        System.out.print("Informe o cumprimento do raio do círculo: ");
        C1.setRaio(ler.nextDouble());

       if (C1.getRaio() > 15) {
            System.out.println("Área do círculo: " + C1.area());
            System.out.println("Circunferência: " + C1.circunferencia());
        }

        System.out.println("==========Loop de 10==========");
        for (int i =0; i <= 10; i++) {
            if (i % 2 == 0) {
                Q1.setLado(i);
                System.out.println("Área do quadrado: " + Q1.area());
            } else {
                C1.setRaio(i);
                System.out.println("Área do cículo" + C1.area());
            }
        }
    }
}