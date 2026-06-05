'use client';

import { useState } from 'react';
import BdAlert from '@/components/BdAlert';
import BdButton from '@/components/BdButton';
import { Reserva } from '@/lib/reservas-api';

type Props = {
  open: boolean;
  reserva: Reserva | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export default function CancelModal({ open, reserva, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !reserva) return null;

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cancelar la reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => { if (!loading) onClose(); }} />
      <div className="relative z-10 w-full max-w-md p-bd-lg">
        <div className="bd-card">
          <h3 className="bd-card-title">Cancelar reserva</h3>
          {error && <BdAlert variant="error" message={error} onClose={() => setError(null)} />}
          <p className="text-bd-secondary text-sm leading-6">
            ¿Estás seguro de que querés cancelar esta reserva?
          </p>
          <ul className="mt-bd-md flex flex-col gap-bd-xs text-bd-primary text-sm">
            <li><span className="text-bd-muted">Reserva:</span> {reserva._id}</li>
            <li><span className="text-bd-muted">Huésped:</span> {reserva.huesped?.nombreApellido || reserva.huesped?.idUsuario || '-'}</li>
            <li><span className="text-bd-muted">Check in:</span> {reserva.checkIn}</li>
            <li><span className="text-bd-muted">Check out:</span> {reserva.checkOut}</li>
          </ul>
          <p className="text-bd-muted text-xs mt-bd-md">
            Esta acción no se puede deshacer.
          </p>
          <div className="mt-bd-lg flex flex-col gap-bd-sm sm:flex-row sm:justify-end">
            <BdButton variant="ghost" onClick={() => !loading && onClose()} disabled={loading}>
              Volver
            </BdButton>
            <BdButton variant="danger" onClick={handleConfirm} disabled={loading}>
              {loading ? 'Cancelando...' : 'Cancelar reserva'}
            </BdButton>
          </div>
        </div>
      </div>
    </div>
  );
}
