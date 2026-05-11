'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { actualizarTipoHabitacion, getTipoHabitacionPorId, TipoHabitacionRecord } from '@/lib/gestion-api';

export default function EditarTipoHabitacionPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TipoHabitacionRecord>({ nombre: '', descripcion: '', capacidad: 1 });

  const tipoId = Number(Array.isArray(params.id) ? params.id[0] : params.id);

  useEffect(() => {
    const fetchTipo = async () => {
      try {
        setLoading(true);
        setError(null);
        const tipo = await getTipoHabitacionPorId(tipoId);
        setFormData({ nombre: tipo.nombre, descripcion: tipo.descripcion || '', capacidad: tipo.capacidad });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el tipo de habitación');
      } finally {
        setLoading(false);
      }
    };

    if (tipoId) fetchTipo();
  }, [tipoId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const tipo = await actualizarTipoHabitacion(tipoId, formData);
      router.push(tipo?.id ? `/gestion/tipos-habitacion/${tipo.id}` : '/gestion/tipos-habitacion');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el tipo de habitación');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <Link href={`/gestion/tipos-habitacion/${tipoId}`} style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Tipo de Habitación
      </Link>
      <h1>Editar Tipo de Habitación</h1>
      {error && <div style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

      {loading ? <p>Cargando...</p> : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <label>Nombre *<input required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} style={{ width: '100%', padding: '8px' }} /></label>
          <label>Descripción<textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} style={{ width: '100%', padding: '8px' }} /></label>
          <label>Capacidad *<input required type="number" min={1} value={formData.capacidad} onChange={(e) => setFormData({ ...formData, capacidad: Number(e.target.value) })} style={{ width: '100%', padding: '8px' }} /></label>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.push(`/gestion/tipos-habitacion/${tipoId}`)} disabled={saving} style={{ padding: '10px 20px' }}>Cancelar</button>
            <button type="submit" disabled={saving} style={{ padding: '10px 20px', backgroundColor: saving ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}