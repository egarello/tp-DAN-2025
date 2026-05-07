'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getHuespedPorId, Huesped } from '@/lib/api';

export default function HuespedDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [huesped, setHuesped] = useState<Huesped | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <p>Huésped no encontrado</p>
      )}
    </div>
  );
}