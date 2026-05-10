'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { crearTipoHabitacion, TipoHabitacionRecord } from '@/lib/gestion-api';

export default function NuevoTipoHabitacionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TipoHabitacionRecord>({ nombre: '', descripcion: '', capacidad: 1 });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tipo = await crearTipoHabitacion(formData);
      router.push(tipo?.id ? `/gestion/tipos-habitacion/${tipo.id}` : '/gestion/tipos-habitacion');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el tipo de habitación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <Link href="/gestion/tipos-habitacion" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Tipos de Habitación
      </Link>
      <h1>Nuevo Tipo de Habitación</h1>
      {error && <div style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <label>Nombre *<input required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} style={{ width: '100%', padding: '8px' }} /></label>
        <label>Descripción<textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} style={{ width: '100%', padding: '8px' }} /></label>
        <label>Capacidad *<input required type="number" min={1} value={formData.capacidad} onChange={(e) => setFormData({ ...formData, capacidad: Number(e.target.value) })} style={{ width: '100%', padding: '8px' }} /></label>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => router.push('/gestion/tipos-habitacion')} disabled={loading} style={{ padding: '10px 20px' }}>Cancelar</button>
          <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: loading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            {loading ? 'Guardando...' : 'Crear Tipo'}
          </button>
        </div>
      </form>
    </div>
  );
}
