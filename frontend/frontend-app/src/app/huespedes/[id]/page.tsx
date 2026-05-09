'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { eliminarHuespedPorDni, eliminarTarjetaCredito, getHuespedPorId, Huesped } from '@/lib/api';

export default function HuespedDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [huesped, setHuesped] = useState<Huesped | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingAction, setDeletingAction] = useState<string | null>(null);

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

  const handleEliminarTarjeta = async (tarjetaId: number) => {
    if (!huesped?.tarjetaCredito) return;

    const tarjeta = huesped.tarjetaCredito.find((item) => item.id === tarjetaId);
    if (!tarjeta) return;

    const confirmed = window.confirm(`¿Eliminar la tarjeta terminada en ${tarjeta.numero.slice(-4)}?`);
    if (!confirmed) return;

    try {
      setError(null);
      setSuccess(null);
      setDeletingAction(`tarjeta-${tarjetaId}`);

      await eliminarTarjetaCredito(huesped.dni, {
        numeroCC: tarjeta.numero,
        idBanco: tarjeta.banco.id,
      });

      setHuesped({
        ...huesped,
        tarjetaCredito: huesped.tarjetaCredito.filter((item) => item.id !== tarjetaId),
      });
      setSuccess('Tarjeta eliminada correctamente.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la tarjeta');
    } finally {
      setDeletingAction(null);
    }
  };

  const handleEliminarHuesped = async () => {
    if (!huesped) return;

    const confirmed = window.confirm(`¿Eliminar definitivamente al huésped ${huesped.nombre} con DNI ${huesped.dni}?`);
    if (!confirmed) return;

    try {
      setError(null);
      setSuccess(null);
      setDeletingAction('huesped');

      await eliminarHuespedPorDni(huesped.dni);
      setSuccess('Huésped eliminado correctamente. Redirigiendo...');

      setTimeout(() => {
        router.push('/huespedes');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el huésped');
    } finally {
      setDeletingAction(null);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <button
        onClick={() => router.back()}
        style={{ padding: '8px 16px', marginBottom: '20px', cursor: 'pointer' }}
      >
        ← Volver
      </button>

      <h1>Detalle del Huésped</h1>

      {error && (
        <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div style={{ color: 'green', padding: '10px', margin: '10px 0', border: '1px solid green', backgroundColor: '#e6ffe6' }}>
          {success}
        </div>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : huesped ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '600px' }}>
          <p>
            <strong>ID:</strong> {huesped.id}
          </p>
          <p>
            <strong>Nombre:</strong> {huesped.nombre}
          </p>
          {/* <p>
            <strong>Apellido:</strong> {huesped.apellido}
          </p> */}
          <p>
            <strong>DNI:</strong> {huesped.dni}
          </p>
          <p>
            <strong>Email:</strong> {huesped.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {huesped.telefono}
          </p>
          {huesped.fechaNacimiento && (
            <p>
              <strong>Fecha de Nacimiento:</strong> {huesped.fechaNacimiento}
            </p>
          )}
          {huesped.tarjetaCredito && huesped.tarjetaCredito.length > 0 && (
            <>
              <h3 style={{ marginTop: '20px' }}>Tarjetas de Crédito</h3>
              {huesped.tarjetaCredito.map((tarjeta) => (
                <div key={tarjeta.id} style={{ border: '1px solid #ddd', padding: '10px', marginTop: '10px', borderRadius: '4px' }}>
                  <p><strong>Número:</strong> {tarjeta.numero}</p>
                  <p><strong>Titular:</strong> {tarjeta.nombreTitular}</p>
                  <p><strong>Vencimiento:</strong> {tarjeta.fechaVencimiento}</p>
                  <p><strong>Principal:</strong> {tarjeta.esPrincipal ? 'Sí' : 'No'}</p>
                  <p><strong>Banco:</strong> {tarjeta.banco.nombre}</p>
                  <button
                    onClick={() => handleEliminarTarjeta(tarjeta.id)}
                    disabled={Boolean(deletingAction)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: deletingAction === `tarjeta-${tarjeta.id}` ? '#ccc' : '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: deletingAction ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {deletingAction === `tarjeta-${tarjeta.id}` ? 'Eliminando...' : 'Eliminar Tarjeta'}
                  </button>
                </div>
              ))}
            </>
          )}
          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            {huesped.tarjetaCredito && huesped.tarjetaCredito.length > 0 && (
              <>
                <button
                  onClick={() => router.push(`/huespedes/${params.id}/cambiar-tarjeta-principal`)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#ffc107',
                    color: 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                  }}
                >
                  Cambiar Tarjeta Principal
                </button>
                <button
                  onClick={() => router.back()}
                  style={{
                    marginLeft: '10px',
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                  }}
                >
                  ← Volver
                </button>
              </>
            )}
            {(!huesped.tarjetaCredito || huesped.tarjetaCredito.length === 0) && (
              <button
                onClick={() => router.back()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9em',
                }}
              >
                ← Volver
              </button>
            )}
            <button
              onClick={handleEliminarHuesped}
              disabled={Boolean(deletingAction)}
              style={{
                marginLeft: '10px',
                padding: '10px 20px',
                backgroundColor: deletingAction === 'huesped' ? '#ccc' : '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: deletingAction ? 'not-allowed' : 'pointer',
                fontSize: '0.9em',
              }}
            >
              {deletingAction === 'huesped' ? 'Eliminando...' : 'Eliminar Huésped'}
            </button>
          </div>
        </div>
      ) : (
        <p>Huésped no encontrado</p>
      )}
    </div>
  );
}
