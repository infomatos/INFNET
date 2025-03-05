package dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CarroDTOOutput {
    private int id;
    private String modelo;
    private String placa;
}
