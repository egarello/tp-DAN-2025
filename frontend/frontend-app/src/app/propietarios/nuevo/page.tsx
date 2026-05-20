'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { crearPropietario, PropietarioRecord, getBancos, Banco } from '@/lib/api';
import BdPageLayout from '@/components/BdPageLayout';

export default function NuevoPropietarioPage() {
  const router = useRouter();
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<PropietarioRecord>({
    nombre: '',
    dni: '',
    email: '',
    telefono: '',
    idHotel: undefined,
    cuentaBancaria: {
      numeroCuenta: '',
      cbu: '',
      alias: '',
      idBanco: 0,
    },
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
    const { name, value } = e.target;
    
    if (name in formData.cuentaBancaria) {
      setFormData((prev) => ({
        ...prev,
        cuentaBancaria: {
          ...prev.cuentaBancaria,
          [name]: name === 'idBanco' ? parseInt(value) : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'idHotel' ? (value ? parseInt(value) : undefined) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await crearPropietario(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/usuarios');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el propietario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BdPageLayout><div className="mx-auto" style={{ maxWidth: 900 }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Inicio
      </Link>

      <h1>Nuevo Propietario</h1>

      {error && (
        <div style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red', borderRadius: '4px', backgroundColor: '#ffe6e6' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div style={{ color: 'green', padding: '10px', marginBottom: '20px', border: '1px solid green', borderRadius: '4px', backgroundColor: '#e6ffe6' }}>
          ¡Propietario creado exitosamente! Redirigiendo...
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <fieldset style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <legend style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Datos del Propietario</legend>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label htmlFor="nombre" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre * (mín. 5 caracteres)</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                minLength={5}
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
              <label htmlFor="dni" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>DNI</label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="idHotel" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hotel asociado</label>
              <input
                type="number"
                id="idHotel"
                name="idHotel"
                value={formData.idHotel ?? ''}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <legend style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Cuenta Bancaria *</legend>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label htmlFor="numeroCuenta" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Número de Cuenta *</label>
              <input
                type="text"
                id="numeroCuenta"
                name="numeroCuenta"
                value={formData.cuentaBancaria.numeroCuenta}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="cbu" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>CBU *</label>
              <input
                type="text"
                id="cbu"
                name="cbu"
                value={formData.cuentaBancaria.cbu}
                onChange={handleChange}
                required
                maxLength={22}
                placeholder="1230000000000000000001"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="alias" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Alias</label>
              <input
                type="text"
                id="alias"
                name="alias"
                value={formData.cuentaBancaria.alias}
                onChange={handleChange}
                placeholder="mi.alias.bancario"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="idBanco" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Banco *</label>
              <select
                id="idBanco"
                name="idBanco"
                value={formData.cuentaBancaria.idBanco || ''}
                onChange={handleChange}
                required
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
          </div>
        </fieldset>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => router.push('/')}
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
            {loading ? 'Guardando...' : 'Crear Propietario'}
          </button>
        </div>
      </form>
    </div></BdPageLayout>
  );
}
