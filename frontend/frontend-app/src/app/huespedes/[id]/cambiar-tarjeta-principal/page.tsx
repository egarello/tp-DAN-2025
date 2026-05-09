'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getHuespedPorId, Huesped, cambiarTarjetaPrincipal, TarjetaCreditoRecord } from '@/lib/api';

export default function CambiarTarjetaPrincipalPage() {
  const params = useParams();
  const router = useRouter();
  const [huesped, setHuesped] = useState<Huesped | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedTarjetaId, setSelectedTarjetaId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const fetchHuesped = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getHuespedPorId(Number(id));
        setHuesped(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHuesped();
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTarjetaId || !huesped) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Find the selected tarjeta
      const tarjeta = huesped.tarjetaCredito?.find(t => t.id === selectedTarjetaId);
      if (!tarjeta) throw new Error('Tarjeta no encontrada');

      // Prepare data for PUT request (minimum required fields)
      const tarjetaData: Partial<TarjetaCreditoRecord> = {
        numeroCC: tarjeta.numero,
        idBanco: tarjeta.banco.id
      };

      await cambiarTarjetaPrincipal(huesped.dni, tarjetaData);
      setSuccess(true);
      
      // Redirect back to detail page after success
      setTimeout(() => {
        router.push(`/huespedes/${params.id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar la tarjeta principal');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
        <p>Cargando datos del huésped...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red', borderRadius: '4px', backgroundColor: '#ffe6e6' }}>
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={() => router.back()}
          style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          ← Volver
        </button>
      </div>
    );
  }

  if (!huesped) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
        <p>Huésped no encontrado</p>
        <button
          onClick={() => router.back()}
          style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          ← Volver
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => router.back()}
          style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          ← Volver al detalle
        </button>
        <h1>Cambiar Tarjeta Principal</h1>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2>{huesped.nombre} (DNI: {huesped.dni})</h2>
        <p>Seleccione qué tarjeta desea establecer como principal:</p>
      </div>

      {success && (
        <div style={{ color: 'green', padding: '10px', marginBottom: '20px', border: '1px solid green', borderRadius: '4px', backgroundColor: '#e6ffe6' }}>
          ¡Tarjeta principal actualizada exitosamente! Redirigiendo...
        </div>
      )}

      {!huesped.tarjetaCredito || huesped.tarjetaCredito.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>Este huésped no tiene tarjetas de crédito registradas.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <fieldset style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
            <legend style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Tarjetas de Crédito</legend>
            
            {huesped.tarjetaCredito.map((tarjeta) => (
              <div key={tarjeta.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '4px', backgroundColor: selectedTarjetaId === tarjeta.id ? '#e6ffe6' : 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input
                    type="radio"
                    id={`tarjeta-${tarjeta.id}`}
                    name="tarjetaSeleccionada"
                    value={tarjeta.id}
                    checked={selectedTarjetaId === tarjeta.id}
                    onChange={(e) => setSelectedTarjetaId(Number(e.target.value))}
                    style={{ marginRight: '10px', width: '18px', height: '18px' }}
                  />
                  <div>
                    <strong>Tarjeta terminada en {tarjeta.numero.slice(-4)}</strong>
                    {tarjeta.esPrincipal ? ' (ACTUALMENTE PRINCIPAL)' : ''}
                  </div>
                </div>
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  <p><strong>Titular:</strong> {tarjeta.nombreTitular}</p>
                  <p><strong>Vencimiento:</strong> {tarjeta.fechaVencimiento}</p>
                  <p><strong>Banco:</strong> {tarjeta.banco.nombre}</p>
                </div>
              </div>
            ))}
          </fieldset>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '1em',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedTarjetaId || saving}
              style={{
                padding: '10px 20px',
                backgroundColor: (!selectedTarjetaId || saving) ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (!selectedTarjetaId || saving) ? 'not-allowed' : 'pointer',
                fontSize: '1em',
              }}
            >
              {saving ? 'Guardando...' : 'Cambiar a Principal'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}