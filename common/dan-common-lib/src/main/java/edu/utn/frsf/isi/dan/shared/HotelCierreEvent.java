package edu.utn.frsf.isi.dan.shared;

import java.time.LocalDateTime;
import java.util.List;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelCierreEvent {
    private Integer hotelId;
    private List<Integer> habitacionIds;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private TipoEvento tipoEvento;
}
