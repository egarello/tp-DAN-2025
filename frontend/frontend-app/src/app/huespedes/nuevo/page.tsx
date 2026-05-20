'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { crearHuesped, HuespedRecord, getBancos, Banco } from '@/lib/api';
import BdPageLayout from '@/components/BdPageLayout';

export default function NuevoHuespedPage() {
  const router = useRouter();
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<HuespedRecord>({
    nombre: '',
    dni: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    numeroCC: '',
    nombreTitular: '',
    fechaVencimientoCC: '',
    cvcCC: '',
    esPrincipalCC: true,
    idBanco: undefined,
  });

  useEffect(() => {
    const fetchBancos = async () => {
      try {
        const data = await getBancos(0, 100);
        setBancos(data.content);
      } catch (err) {
        console.error('Error cargando bancos:', err);
      }
    };
    fetchBancos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      [name]: name === 'idBanco' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await crearHuesped(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/huespedes');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el huésped');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BdPageLayout><div className="mx-auto" style={{ maxWidth: 800 }}>
      <Link href="/huespedes" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Volver a Huéspedes
      </Link>

      <h1>Nuevo Huésped</h1>

      {error && (
        <div style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red', borderRadius: '4px', backgroundColor: '#ffe6e6' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div style={{ color: 'green', padding: '10px', marginBottom: '20px', border: '1px solid green', borderRadius: '4px', backgroundColor: '#e6ffe6' }}>
          ¡Huésped creado exitosamente! Redirigiendo...
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <fieldset style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <legend style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Datos del Huésped</legend>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label htmlFor="nombre" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="dni" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>DNI *</label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="telefono" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Teléfono *</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="fechaNacimiento" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fecha de Nacimiento</label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <legend style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Tarjeta de Crédito (opcional)</legend>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label htmlFor="numeroCC" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Número de Tarjeta</label>
              <input
                type="text"
                id="numeroCC"
                name="numeroCC"
                value={formData.numeroCC}
                onChange={handleChange}
                maxLength={16}
                placeholder="4111111111111111"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="nombreTitular" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre del Titular</label>
              <input
                type="text"
                id="nombreTitular"
                name="nombreTitular"
                value={formData.nombreTitular}
                onChange={handleChange}
                placeholder="JUAN PEREZ"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="fechaVencimientoCC" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fecha Vencimiento (MM/YY)</label>
              <input
                type="text"
                id="fechaVencimientoCC"
                name="fechaVencimientoCC"
                value={formData.fechaVencimientoCC}
                onChange={handleChange}
                placeholder="12/25"
                maxLength={5}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="cvcCC" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>CVC</label>
              <input
                type="text"
                id="cvcCC"
                name="cvcCC"
                value={formData.cvcCC}
                onChange={handleChange}
                maxLength={4}
                placeholder="123"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="idBanco" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Banco</label>
              <select
                id="idBanco"
                name="idBanco"
                value={formData.idBanco ?? ''}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="">Seleccionar banco</option>
                {bancos.map((banco) => (
                  <option key={banco.id} value={banco.id}>
                    {banco.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id="esPrincipalCC"
                name="esPrincipalCC"
                checked={formData.esPrincipalCC ?? true}
                onChange={handleChange}
                style={{ marginRight: '8px', width: '18px', height: '18px' }}
              />
              <label htmlFor="esPrincipalCC" style={{ fontWeight: 'bold' }}>¿Es tarjeta principal?</label>
            </div>
          </div>
        </fieldset>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => router.push('/huespedes')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1em',
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1em',
            }}
          >
            {loading ? 'Guardando...' : 'Crear Huésped'}
          </button>
        </div>
      </form>
    </div></BdPageLayout>
  );
}
