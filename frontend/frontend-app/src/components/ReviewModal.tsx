'use client';

import { useState } from 'react';
import BdButton from '@/components/BdButton';
import BdAlert from '@/components/BdAlert';
import { Review } from '@/lib/reservas-api';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (review: Review) => Promise<void> | void;
};

export default function ReviewModal({ open, onClose, onSubmit }: Props) {
  const [rating, setRating] = useState<number | ''>('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const review: Review = {
        rating: rating === '' ? undefined : Number(rating),
        comment: comment || undefined,
        createdAt: new Date().toISOString(),
      };
      await onSubmit(review);
      setRating('');
      setComment('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error enviando review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => { if (!loading) onClose(); }} />
      <div className="relative z-10 w-full max-w-md p-bd-lg">
        <div className="bd-card">
          <h3 className="bd-card-title">Review del anfitrión</h3>
          {error && <BdAlert variant="error" message={error} onClose={() => setError(null)} />}
          <div className="grid gap-4">
            <label>
              Puntuación (opcional)
              <select className="bd-input" value={rating} onChange={(e) => setRating(e.target.value === '' ? '' : Number(e.target.value))} disabled={loading}>
                <option value="">Sin puntuación</option>
                <option value={5}>5</option>
                <option value={4}>4</option>
                <option value={3}>3</option>
                <option value={2}>2</option>
                <option value={1}>1</option>
              </select>
            </label>
            <label>
              Comentario (opcional)
              <textarea className="bd-input" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} disabled={loading} />
            </label>
            <div className="flex gap-2 justify-end">
              <BdButton variant="ghost" onClick={() => !loading && onClose()}>Cancelar</BdButton>
              <BdButton variant="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Enviando...' : 'Finalizar reserva'}
              </BdButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
