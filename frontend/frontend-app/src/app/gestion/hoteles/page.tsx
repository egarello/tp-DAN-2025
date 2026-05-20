'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getHoteles, Hotel } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';

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
      <Link href="/gestion" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Gestión
      </Link>

      <h1>Hoteles</h1>
      <Link href="/gestion/hoteles/nuevo" style={{ display: 'inline-block', marginBottom: '20px', padding: '10px 16px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        + Nuevo Hotel
      </Link>

      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

      {loading ? <p>Cargando...</p> : hoteles.length === 0 ? <p>No hay hoteles disponibles</p> : (
        <table border={1} cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Domicilio</th>
              <th>Categoría</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {hoteles.map((hotel) => (
              <tr key={hotel.id}>
                <td>{hotel.nombre}</td>
                <td>{hotel.domicilio || '-'}</td>
                <td>{hotel.categoria ?? '-'}</td>
                <td>{hotel.telefono || '-'}</td>
                <td><Link href={`/gestion/hoteles/${hotel.id}`}>Ver</Link> | <Link href={`/gestion/hoteles/editar/${hotel.id}`}>Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </BdPageLayout>
  );
}
