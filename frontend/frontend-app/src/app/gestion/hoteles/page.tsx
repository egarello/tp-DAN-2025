'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getHoteles, Hotel } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdTable from '@/components/BdTable';
import BdButton from '@/components/BdButton';
import BdBackLink from '@/components/BdBackLink';

export default function HotelesPage() {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoteles = async () => {
      try {
        setLoading(true);
        setError(null);
        setHoteles(await getHoteles());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchHoteles();
  }, []);

  return (
    <BdPageLayout>
      <BdBackLink href="/gestion">Gestión</BdBackLink>

      <h1 className="text-bd-primary">Hoteles</h1>
      <div className="flex flex-wrap gap-bd-sm">
        <BdButton href="/gestion/hoteles/nuevo" variant="primary" size="md">+ Nuevo Hotel</BdButton>
        <BdButton href="/gestion/hoteles/buscar" variant="ghost" size="md">Buscar</BdButton>
      </div>

      {error && <div className="bd-alert bd-alert-error" /* style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }} */><strong>Error:</strong> {error}</div>}

      {loading ? <p className="bd-skeleton bd-skeleton-text">Cargando...</p> : hoteles.length === 0 ? <p className="text-bd-secondary">No hay hoteles disponibles</p> : (
        <BdTable><table className="bd-table w-full" border={1} cellPadding="10" /* style={{ width: '100%', marginTop: '20px' }} */>
          <thead>
            <tr>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Nombre</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Domicilio</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Categoría</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Teléfono</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {hoteles.map((hotel) => (
              <tr key={hotel.id}>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{hotel.nombre}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{hotel.domicilio || '-'}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{hotel.categoria ?? '-'}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{hotel.telefono || '-'}</td>
                <td className="p-bd-md border-b border-bd-subtle bd-row-actions"><Link className="text-bd-link" href={`/gestion/hoteles/${hotel.id}`}>Ver</Link> | <Link className="text-bd-link" href={`/gestion/hoteles/editar/${hotel.id}`}>Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table></BdTable>
      )}
    </BdPageLayout>
  );
}
