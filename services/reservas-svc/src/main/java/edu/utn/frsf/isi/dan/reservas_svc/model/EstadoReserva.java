package edu.utn.frsf.isi.dan.reservas_svc.model;

import java.util.Set;

public enum EstadoReserva {
    CONFIRMADA {
        @Override
        public Set<EstadoReserva> transicionesValidas() {
            return Set.of(RESERVADA, CANCELADA, ADEUDADA, CERRADO, BLOQUEADA);
        }
    },
    RESERVADA {
        @Override
        public Set<EstadoReserva> transicionesValidas() {
            return Set.of(ADEUDADA, CANCELADA, CERRADO, BLOQUEADA);
        }
    },
    CANCELADA {
        @Override
        public Set<EstadoReserva> transicionesValidas() {
            return Set.of(CERRADO, BLOQUEADA);
        }
    },
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
    public static final Set<EstadoReserva> ESTADOS_FINALES = Set.of(FINALIZADA, CERRADO, BLOQUEADA);

    public abstract Set<EstadoReserva> transicionesValidas();

    public boolean puedeTransicionarA(EstadoReserva nuevoEstado) {
        return transicionesValidas().contains(nuevoEstado);
    }
}
