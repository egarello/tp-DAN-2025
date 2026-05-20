'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getTiposHabitacion, TipoHabitacion } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';

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
      <Link href="/gestion" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Gestión
      </Link>

      <h1>Tipos de Habitación</h1>
      <Link href="/gestion/tipos-habitacion/nuevo" style={{ display: 'inline-block', marginBottom: '20px', padding: '10px 16px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        + Nuevo Tipo de Habitación
      </Link>
      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}
      {loading ? <p>Cargando...</p> : tipos.length === 0 ? <p>No hay tipos de habitación disponibles</p> : (
        <table border={1} cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Capacidad</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipos.map((tipo) => (
              <tr key={tipo.id}>
                <td>{tipo.nombre}</td>
                <td>{tipo.capacidad}</td>
                <td>{tipo.descripcion || '-'}</td>
                <td><Link href={`/gestion/tipos-habitacion/${tipo.id}`}>Ver</Link> | <Link href={`/gestion/tipos-habitacion/editar/${tipo.id}`}>Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </BdPageLayout>
  );
}
