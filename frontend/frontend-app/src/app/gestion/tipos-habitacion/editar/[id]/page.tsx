'use client';

import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { actualizarTipoHabitacion, getTipoHabitacionPorId, TipoHabitacionRecord } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdBreadcrumb from '@/components/BdBreadcrumb';
import BdButton from '@/components/BdButton';

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
    <BdPageLayout><div className="mx-auto" style={{ maxWidth: 700 }}>
      <BdBreadcrumb items={[
        { label: 'Gestión', href: '/gestion' },
        { label: 'Tipos de Habitación', href: '/gestion/tipos-habitacion' },
        { label: formData.nombre || `Tipo ${tipoId}`, href: `/gestion/tipos-habitacion/${tipoId}` },
        { label: 'Editar' },
      ]} />
      <h1>Editar Tipo de Habitación</h1>
      {error && <div style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

      {loading ? <p>Cargando...</p> : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <label>Nombre *<input required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} style={{ width: '100%', padding: '8px' }} /></label>
          <label>Descripción<textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} style={{ width: '100%', padding: '8px' }} /></label>
          <label>Capacidad *<input required type="number" min={1} value={formData.capacidad} onChange={(e) => setFormData({ ...formData, capacidad: Number(e.target.value) })} style={{ width: '100%', padding: '8px' }} /></label>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <BdButton type="button" variant="ghost" onClick={() => router.push(`/gestion/tipos-habitacion/${tipoId}`)} disabled={saving}>Cancelar</BdButton>
            <button type="submit" disabled={saving} style={{ padding: '10px 20px', backgroundColor: saving ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      )}
    </div></BdPageLayout>
  );
}