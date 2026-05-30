'use client';

import { useState } from 'react';
import BdButton from '@/components/BdButton';
import BdAlert from '@/components/BdAlert';
import { Pago } from '@/lib/reservas-api';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (pago: Pago) => Promise<void> | void;
  saldoPendiente?: number;
};

export default function PaymentModal({ open, onClose, onSubmit, saldoPendiente }: Props) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('tarjeta');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const parseAmount = () => Number((amount || '').replace(',', '.')) || 0;

  const validate = (): string | null => {
    const val = parseAmount();
    if (val <= 0) return 'Ingrese un monto mayor a 0';
    if (saldoPendiente != null && val > saldoPendiente) return `El monto no puede superar el saldo (${saldoPendiente})`;
    return null;
  };

  const handleSubmit = async () => {
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }
    setLoading(true);
    try {
      const pago: Pago = {
        method,
        amount: { precio: parseAmount(), moneda: 'ARS' },
      };
      if ((globalThis as any)?.crypto?.randomUUID) {
        pago.transactionId = (globalThis as any).crypto.randomUUID();
      } else {
        pago.transactionId = `${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
      }
      await onSubmit(pago);
      setAmount('');
      setMethod('tarjeta');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => { if (!loading) onClose(); }} />
      <div className="relative z-10 w-full max-w-md p-bd-lg">
        <div className="bd-card">
          <h3 className="bd-card-title">Realizar pago</h3>
          {error && <BdAlert variant="error" message={error} onClose={() => setError(null)} />}
          <div className="grid gap-4">
            <label>
              Monto (ARS)
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bd-input"
                placeholder={saldoPendiente != null ? `Saldo: ${saldoPendiente}` : ''}
                disabled={loading}
              />
            </label>
            <label>
              Método
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="bd-input" disabled={loading}>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo</option>
              </select>
            </label>
            <div className="flex gap-2 justify-end">
              <BdButton variant="ghost" onClick={() => !loading && onClose()}>Cancelar</BdButton>
              <BdButton variant="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Procesando...' : 'Pagar'}
              </BdButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
