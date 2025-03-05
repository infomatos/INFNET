package model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Carro {
    private int id;
    private String modelo;
    private String placa;
    private String chassi;
}
