'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getHuespedPorId, Huesped, cambiarTarjetaPrincipal, TarjetaCreditoRecord } from '@/lib/api';
import BdPageLayout from '@/components/BdPageLayout';
import BdBackLink from '@/components/BdBackLink';
import BdButton from '@/components/BdButton';
import BdAlert from '@/components/BdAlert';
import BdBreadcrumb from '@/components/BdBreadcrumb';

export default function CambiarTarjetaPrincipalPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [huesped, setHuesped] = useState<Huesped | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedTarjetaId, setSelectedTarjetaId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
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
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTarjetaId || !huesped) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const tarjeta = huesped.tarjetaCredito?.find(t => t.id === selectedTarjetaId);
      if (!tarjeta) throw new Error('Tarjeta no encontrada');

      const tarjetaData: Partial<TarjetaCreditoRecord> = {
        numeroCC: tarjeta.numero,
        idBanco: tarjeta.banco.id
      };

      await cambiarTarjetaPrincipal(huesped.dni, tarjetaData);
      setSuccess(true);

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
      <BdPageLayout>
        <div className="text-center py-12">
          <p className="text-bd-secondary">Cargando datos del huésped...</p>
        </div>
      </BdPageLayout>
    );
  }

  if (error) {
    return (
      <BdPageLayout>
        <BdAlert variant="error" className="mb-bd-lg">
          <strong>Error:</strong> {error}
        </BdAlert>
        <BdBackLink href={`/huespedes/${params.id}`} />
      </BdPageLayout>
    );
  }

  if (!huesped) {
    return (
      <BdPageLayout>
        <div className="bd-empty-state">
          <p className="bd-empty-state-title">Huésped no encontrado</p>
          <BdButton variant="primary" className="bd-empty-state-action" onClick={() => router.push(`/huespedes/${params.id}`)}>
            ← Volver
          </BdButton>
        </div>
      </BdPageLayout>
    );
  }

  return (
    <BdPageLayout>
      <div className="mx-auto max-w-3xl">
        <BdBreadcrumb items={[
          { label: 'Huéspedes', href: '/huespedes' },
          { label: huesped?.nombre ?? `Huésped ${id}`, href: `/huespedes/${id}` },
          { label: 'Cambiar tarjeta principal' },
        ]} />

        <h1 className="text-bd-primary text-bd-xl font-bold mb-bd-lg">Cambiar Tarjeta Principal</h1>

        <div className="bd-card mb-bd-lg">
          <h2 className="bd-card-title">{huesped.nombre} (DNI: {huesped.dni})</h2>
          <p className="text-bd-secondary text-bd-md">Seleccione qué tarjeta desea establecer como principal:</p>
        </div>

        {success && (
          <BdAlert variant="success" className="mb-bd-lg">
            ¡Tarjeta principal actualizada exitosamente! Redirigiendo...
          </BdAlert>
        )}

        {!huesped.tarjetaCredito || huesped.tarjetaCredito.length === 0 ? (
          <p className="bd-empty-state-message text-center">Este huésped no tiene tarjetas de crédito registradas.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-bd-lg">
            <div className="bd-card p-bd-xl">
              <h2 className="text-bd-muted text-bd-xs uppercase tracking-widest mb-bd-lg">Tarjetas de Crédito</h2>

              {huesped.tarjetaCredito.map((tarjeta) => (
                <div key={tarjeta.id} className={`border ${selectedTarjetaId === tarjeta.id ? 'border-bd-medium bg-bd-card-hover' : 'border-bd-subtle bg-bd-card'} rounded-bd-md p-bd-lg mb-bd-sm`}>
                  <div className="flex items-center gap-bd-md mb-bd-sm">
                    {/* TODO: SKILL/BRAND no cubren radio inputs — usar Tailwind nativo */}
                    <input
                      type="radio"
                      id={`tarjeta-${tarjeta.id}`}
                      name="tarjetaSeleccionada"
                      value={tarjeta.id}
                      checked={selectedTarjetaId === tarjeta.id}
                      onChange={(e) => setSelectedTarjetaId(Number(e.target.value))}
                      className="w-4 h-4"
                    />
                    <div>
                      <span className="font-semibold text-bd-primary">Tarjeta terminada en {tarjeta.numero.slice(-4)}</span>
                      {tarjeta.esPrincipal ? <span className="text-bd-free font-semibold ml-bd-sm">(ACTUALMENTE PRINCIPAL)</span> : ''}
                    </div>
                  </div>
                  <div className="text-bd-sm text-bd-secondary space-y-1">
                    <p><span className="font-medium text-bd-primary">Titular:</span> {tarjeta.nombreTitular}</p>
                    <p><span className="font-medium text-bd-primary">Vencimiento:</span> {tarjeta.fechaVencimiento}</p>
                    <p><span className="font-medium text-bd-primary">Banco:</span> {tarjeta.banco.nombre}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-row gap-bd-xl justify-end">
              <BdButton variant="ghost" onClick={() => router.push(`/huespedes/${params.id}`)} disabled={saving}>
                Cancelar
              </BdButton>
              <BdButton variant="cta" type="submit" disabled={!selectedTarjetaId || saving}>
                {saving ? 'Guardando...' : 'Cambiar a Principal'}
              </BdButton>
            </div>
          </form>
        )}
      </div>
    </BdPageLayout>
  );
}