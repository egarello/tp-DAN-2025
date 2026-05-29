package edu.utn.frsf.isi.dan.reservas_svc.model;

import java.util.Set;

public enum EstadoReserva {
    /*
     * El usuario realizo la resrva, y tiene al menos un pago registrado, pero el monto total pagado es menor al precio total de la reserva.
     */
    CONFIRMADA {
        @Override
        public Set<EstadoReserva> transicionesValidas() {
            return Set.of(FINALIZADA, ADEUDADA, CERRADO, BLOQUEADA);
        }
    },
    /**
     * El usuario realizo la reserva, y no tiene ningun pago registrado.
     */
    RESERVADA {
        @Override
        public Set<EstadoReserva> transicionesValidas() {
            return Set.of(ADEUDADA, CONFIRMADA, CANCELADA, CERRADO, BLOQUEADA);
        }
    },
    CANCELADA {
        @Override
        public Set<EstadoReserva> transicionesValidas() {
            return Set.of();
        }
    },
    /**
     * El usuario dejo una review luego de su estadia
     */
    FINALIZADA {
        @Override
        public Set<EstadoReserva> transicionesValidas() {
            return Set.of(CERRADO, BLOQUEADA);
        }
    },
    BLOQUEADA {
        @Override
        public Set<EstadoReserva> transicionesValidas() {
            return Set.of();
        }
    },
    /**
     * El usuario completo el pago de la reserva, pagoTotal = precioTotal
     */
    ADEUDADA {
        @Override
        public Set<EstadoReserva> transicionesValidas() {
            return Set.of(FINALIZADA, CERRADO, BLOQUEADA);
        }
    },
    CERRADO {
        @Override
        public Set<EstadoReserva> transicionesValidas() {
            return Set.of();
        }
    };

    // Estados finales: desde estos no se puede transicionar a otros estados
    public static final Set<EstadoReserva> ESTADOS_FINALES = Set.of(CANCELADA, FINALIZADA, CERRADO, BLOQUEADA);

    public abstract Set<EstadoReserva> transicionesValidas();

    public boolean puedeTransicionarA(EstadoReserva nuevoEstado) {
        return transicionesValidas().contains(nuevoEstado);
    }
}
