'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getTiposHabitacion, TipoHabitacion } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdTable from '@/components/BdTable';
import BdButton from '@/components/BdButton';
import BdBackLink from '@/components/BdBackLink';

export default function TiposHabitacionPage() {
  const [tipos, setTipos] = useState<TipoHabitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        setLoading(true);
        setError(null);
        setTipos(await getTiposHabitacion());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchTipos();
  }, []);

  return (
    <BdPageLayout>
      <BdBackLink href="/gestion">Gestión</BdBackLink>

      <h1 className="text-bd-primary">Tipos de Habitación</h1>
      <BdButton href="/gestion/tipos-habitacion/nuevo" variant="primary" size="md">+ Nuevo Tipo de Habitación</BdButton>
      {error && <div className="bd-alert bd-alert-error" /* style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }} */><strong>Error:</strong> {error}</div>}
      {loading ? <p className="bd-skeleton bd-skeleton-text">Cargando...</p> : tipos.length === 0 ? <p className="text-bd-secondary">No hay tipos de habitación disponibles</p> : (
        <BdTable><table className="bd-table w-full" border={1} cellPadding="10" /* style={{ width: '100%', marginTop: '20px' }} */>
          <thead>
            <tr>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Nombre</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Capacidad</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Descripción</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipos.map((tipo) => (
              <tr key={tipo.id}>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{tipo.nombre}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{tipo.capacidad}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{tipo.descripcion || '-'}</td>
                <td className="p-bd-md border-b border-bd-subtle bd-row-actions"><Link className="text-bd-link" href={`/gestion/tipos-habitacion/${tipo.id}`}>Ver</Link> | <Link className="text-bd-link" href={`/gestion/tipos-habitacion/editar/${tipo.id}`}>Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table></BdTable>
      )}
    </BdPageLayout>
  );
}
