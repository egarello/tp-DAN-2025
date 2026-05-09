'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getTarifas, Tarifa } from '@/lib/gestion-api';

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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Link href="/gestion" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Gestión
      </Link>

      <h1>Tarifas</h1>
      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}
      {loading ? <p>Cargando...</p> : tarifas.length === 0 ? <p>No hay tarifas disponibles</p> : (
        <table border={1} cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Desde</th>
              <th>Hasta</th>
              <th>Tipo Habitación</th>
              <th>Precio/Noche</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tarifas.map((tarifa) => (
              <tr key={tarifa.id}>
                <td>{tarifa.id}</td>
                <td>{tarifa.fechaInicio}</td>
                <td>{tarifa.fechaFin}</td>
                <td>{tarifa.tipoHabitacion?.nombre || tarifa.tipoHabitacion?.id || '-'}</td>
                <td>{tarifa.precioNoche}</td>
                <td><Link href={`/gestion/tarifas/${tarifa.id}`}>Ver</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
