'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getBancoPorId, Banco } from '@/lib/api';
import BdPageLayout from '@/components/BdPageLayout';
import BdCard from '@/components/BdCard';
import BdBackLink from '@/components/BdBackLink';
import BdAlert from '@/components/BdAlert';

export default function BancoDetailPage() {
  const params = useParams();
  const [banco, setBanco] = useState<Banco | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const fetchBanco = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBancoPorId(Number(id));
        setBanco(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBanco();
    }
  }, [params.id]);

  return (
    <BdPageLayout>
      <BdBackLink href="/bancos" className="mb-bd-lg" />
      {/* style={{ padding: '8px 16px', marginBottom: '20px', cursor: 'pointer' }} */}

      <h1 className="text-bd-primary">Detalle del Banco</h1>

      {error && (
        <BdAlert variant="error" onClose={() => setError(null)}>
          <strong>Error:</strong> {error}
        </BdAlert>
      )}

      {loading ? (
        <div className="bd-skeleton bd-skeleton-text" />
      ) : banco ? (
        <BdCard>
          {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '600px' }} */}
          <p className="text-bd-primary mb-bd-sm">
            <strong>Nombre:</strong> {banco.nombre}
          </p>
          <p className="text-bd-primary mb-bd-sm">
            <strong>Código:</strong> {banco.codigo}
          </p>
        </BdCard>
      ) : (
        <p className="text-bd-secondary">Banco no encontrado</p>
      )}
    </BdPageLayout>
  );
}
