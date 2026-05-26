'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getTarifas, Tarifa } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdTable from '@/components/BdTable';
import BdButton from '@/components/BdButton';
import BdBackLink from '@/components/BdBackLink';

export default function TarifasPage() {
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        setLoading(true);
        setError(null);
        setTarifas(await getTarifas());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchTarifas();
  }, []);

  return (
    <BdPageLayout>
      <BdBackLink href="/gestion">Gestión</BdBackLink>

      <h1 className="text-bd-primary">Tarifas</h1>
      <div className="flex gap-bd-sm mb-bd-xl flex-wrap" /* style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }} */>
        <BdButton href="/gestion/tarifas/nuevo" variant="primary" size="md">+ Nueva Tarifa</BdButton>
        <BdButton href="/gestion/tarifas/promocional/nuevo" variant="cta" size="md">+ Nueva Promoción</BdButton>
      </div>
      {error && <div className="bd-alert bd-alert-error" /* style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }} */><strong>Error:</strong> {error}</div>}
      {loading ? <p className="bd-skeleton bd-skeleton-text">Cargando...</p> : tarifas.length === 0 ? <p className="text-bd-secondary">No hay tarifas disponibles</p> : (
        <BdTable><table className="bd-table w-full" border={1} cellPadding="10" /* style={{ width: '100%', marginTop: '20px' }} */>
          <thead>
            <tr>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Desde</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Hasta</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Tipo Habitación</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Precio/Noche</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tarifas.map((tarifa) => (
              <tr key={tarifa.id}>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{tarifa.fechaInicio}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{tarifa.fechaFin}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{tarifa.tipoHabitacion?.nombre || '-'}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{tarifa.precioNoche}</td>
                <td className="p-bd-md border-b border-bd-subtle bd-row-actions"><Link className="text-bd-link" href={`/gestion/tarifas/${tarifa.id}`}>Ver</Link> | <Link className="text-bd-link" href={`/gestion/tarifas/editar/${tarifa.id}`}>Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table></BdTable>
      )}
    </BdPageLayout>
  );
}
