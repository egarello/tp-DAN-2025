'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { eliminarHuespedPorDni, eliminarTarjetaCredito, getHuespedPorId, Huesped } from '@/lib/api';
import BdPageLayout from '@/components/BdPageLayout';
import BdCard from '@/components/BdCard';
import BdBackLink from '@/components/BdBackLink';
import BdButton from '@/components/BdButton';

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
    <BdPageLayout>
      <BdBackLink onClick={() => router.back()} className="mb-bd-lg" />
      {/* style={{ padding: '8px 16px', marginBottom: '20px', cursor: 'pointer' }} */}

      <h1 className="text-bd-primary">Detalle del Huésped</h1>

      {error && (
        <div className="bd-alert bd-alert-error">
          {/* style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }} */}
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="bd-alert bd-alert-success">
          {/* style={{ color: 'green', padding: '10px', margin: '10px 0', border: '1px solid green', backgroundColor: '#e6ffe6' }} */}
          {success}
        </div>
      )}

      {loading ? (
        <div className="bd-skeleton bd-skeleton-text" />
      ) : huesped ? (
        <BdCard>
          {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '600px' }} */}
          <p className="text-bd-primary mb-bd-sm">
            <strong>Nombre:</strong> {huesped.nombre}
          </p>
          {/* <p>
            <strong>Apellido:</strong> {huesped.apellido}
          </p> */}
          <p className="text-bd-primary mb-bd-sm">
            <strong>DNI:</strong> {huesped.dni}
          </p>
          <p className="text-bd-primary mb-bd-sm">
            <strong>Email:</strong> {huesped.email}
          </p>
          <p className="text-bd-primary mb-bd-sm">
            <strong>Teléfono:</strong> {huesped.telefono}
          </p>
          {huesped.fechaNacimiento && (
            <p className="text-bd-primary mb-bd-sm">
              <strong>Fecha de Nacimiento:</strong> {huesped.fechaNacimiento}
            </p>
          )}
          {huesped.tarjetaCredito && huesped.tarjetaCredito.length > 0 && (
            <>
              <h3 className="text-bd-primary mb-bd-md">
                {/* marginTop: '20px' */}
                Tarjetas de Crédito</h3>
              {huesped.tarjetaCredito.map((tarjeta) => (
                <div key={tarjeta.id} className="bd-card mb-bd-md">
                  {/* style={{ border: '1px solid #ddd', padding: '10px', marginTop: '10px', borderRadius: '4px' }} */}
                  <p className="text-bd-primary mb-bd-sm"><strong>Número:</strong> {tarjeta.numero}</p>
                  <p className="text-bd-primary mb-bd-sm"><strong>Titular:</strong> {tarjeta.nombreTitular}</p>
                  <p className="text-bd-primary mb-bd-sm"><strong>Vencimiento:</strong> {tarjeta.fechaVencimiento}</p>
                  <p className="text-bd-primary mb-bd-sm"><strong>Principal:</strong> {tarjeta.esPrincipal ? 'Sí' : 'No'}</p>
                  <p className="text-bd-primary mb-bd-sm"><strong>Banco:</strong> {tarjeta.banco.nombre}</p>
                  <BdButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleEliminarTarjeta(tarjeta.id)}
                    disabled={Boolean(deletingAction)}
                    className="mt-bd-sm"
                  >
                    {deletingAction === `tarjeta-${tarjeta.id}` ? 'Eliminando...' : 'Eliminar Tarjeta'}
                  </BdButton>
                </div>
              ))}
            </>
          )}
          <div className="mt-bd-lg text-center">
            {huesped.tarjetaCredito && huesped.tarjetaCredito.length > 0 && (
              <>
                <BdButton
                  variant="primary"
                  onClick={() => router.push(`/huespedes/${params.id}/cambiar-tarjeta-principal`)}
                  className="mr-bd-sm"
                >
                  Cambiar Tarjeta Principal
                </BdButton>
                <BdButton variant="ghost" onClick={() => router.back()} className="mr-bd-sm">
                  ← Volver
                </BdButton>
              </>
            )}
            {(!huesped.tarjetaCredito || huesped.tarjetaCredito.length === 0) && (
              <BdButton variant="ghost" onClick={() => router.back()}>
                ← Volver
              </BdButton>
            )}
            <BdButton
              variant="danger"
              onClick={handleEliminarHuesped}
              disabled={Boolean(deletingAction)}
            >
              {deletingAction === 'huesped' ? 'Eliminando...' : 'Eliminar Huésped'}
            </BdButton>
          </div>
        </BdCard>
      ) : (
        <p className="text-bd-secondary">Huésped no encontrado</p>
      )}
    </BdPageLayout>
  );
}
