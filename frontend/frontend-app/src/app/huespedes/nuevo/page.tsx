'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { crearHuesped, HuespedRecord, getBancos, Banco } from '@/lib/api';
import BdPageLayout from '@/components/BdPageLayout';
import BdButton from '@/components/BdButton';
import BdBackLink from '@/components/BdBackLink';
import BdAlert from '@/components/BdAlert';

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
    <BdPageLayout>
      <div className="mx-auto max-w-3xl">
        {/* style={{ maxWidth: 800 }} */}
      <BdBackLink href="/huespedes" className="mb-bd-lg" />
      {/* style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }} */}

      <h1 className="text-bd-primary text-bd-xl font-bold">Nuevo Huésped</h1>

      {error && (
        <BdAlert variant="error" className="mb-bd-lg">
          {/* style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red', borderRadius: '4px', backgroundColor: '#ffe6e6' }} */}
          <strong>Error:</strong> {error}
        </BdAlert>
      )}

      {success && (
        <BdAlert variant="success" className="mb-bd-lg">
          {/* style={{ color: 'green', padding: '10px', marginBottom: '20px', border: '1px solid green', borderRadius: '4px', backgroundColor: '#e6ffe6' }} */}
          ¡Huésped creado exitosamente! Redirigiendo...
        </BdAlert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-bd-lg">
        {/* style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} */}
        <div className="bd-card p-bd-xl">
          <h2 className="text-bd-muted text-bd-xs uppercase tracking-widest mb-bd-lg">Datos del Huésped</h2>
          {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }} */}
          {/* style={{ fontWeight: 'bold', fontSize: '1.2em' }} */}
          
          <div className="grid grid-cols-2 gap-bd-md" /* style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} */>
            <div>
              <label htmlFor="nombre" className="text-bd-muted text-bd-xs block mb-bd-xs">Nombre *</label>
              {/* style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }} */}
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                /* style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} */
              />
            </div>

            <div>
              <label htmlFor="dni" className="text-bd-muted text-bd-xs block mb-bd-xs">DNI *</label>
              {/* style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }} */}
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
                className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                /* style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} */
              />
            </div>

            <div>
              <label htmlFor="email" className="text-bd-muted text-bd-xs block mb-bd-xs">Email *</label>
              {/* style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }} */}
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                /* style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} */
              />
            </div>

            <div>
              <label htmlFor="telefono" className="text-bd-muted text-bd-xs block mb-bd-xs">Teléfono *</label>
              {/* style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }} */}
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                /* style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} */
              />
            </div>

            <div>
              <label htmlFor="fechaNacimiento" className="text-bd-muted text-bd-xs block mb-bd-xs">Fecha de Nacimiento</label>
              {/* style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }} */}
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                /* style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} */
              />
            </div>
          </div>
        </div>

        <div className="bd-card p-bd-xl">
          <h2 className="text-bd-muted text-bd-xs uppercase tracking-widest mb-bd-lg">Tarjeta de Crédito (opcional)</h2>
          {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }} */}
          {/* style={{ fontWeight: 'bold', fontSize: '1.2em' }} */}
          
          <div className="grid grid-cols-2 gap-bd-md" /* style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} */>
            <div>
              <label htmlFor="numeroCC" className="text-bd-muted text-bd-xs block mb-bd-xs">Número de Tarjeta</label>
              {/* style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }} */}
              <input
                type="text"
                id="numeroCC"
                name="numeroCC"
                value={formData.numeroCC}
                onChange={handleChange}
                maxLength={16}
                placeholder="4111111111111111"
                className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                /* style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} */
              />
            </div>

            <div>
              <label htmlFor="nombreTitular" className="text-bd-muted text-bd-xs block mb-bd-xs">Nombre del Titular</label>
              {/* style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }} */}
              <input
                type="text"
                id="nombreTitular"
                name="nombreTitular"
                value={formData.nombreTitular}
                onChange={handleChange}
                placeholder="JUAN PEREZ"
                className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                /* style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} */
              />
            </div>

            <div>
              <label htmlFor="fechaVencimientoCC" className="text-bd-muted text-bd-xs block mb-bd-xs">Fecha Vencimiento (MM/YY)</label>
              {/* style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }} */}
              <input
                type="text"
                id="fechaVencimientoCC"
                name="fechaVencimientoCC"
                value={formData.fechaVencimientoCC}
                onChange={handleChange}
                placeholder="12/25"
                maxLength={5}
                className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                /* style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} */
              />
            </div>

            <div>
              <label htmlFor="cvcCC" className="text-bd-muted text-bd-xs block mb-bd-xs">CVC</label>
              {/* style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }} */}
              <input
                type="text"
                id="cvcCC"
                name="cvcCC"
                value={formData.cvcCC}
                onChange={handleChange}
                maxLength={4}
                placeholder="123"
                className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                /* style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} */
              />
            </div>

            <div>
              <label htmlFor="idBanco" className="text-bd-muted text-bd-xs block mb-bd-xs">Banco</label>
              {/* style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }} */}
              <select
                id="idBanco"
                name="idBanco"
                value={formData.idBanco ?? ''}
                onChange={handleChange}
                className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                /* style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} */
              >
                <option value="">Seleccionar banco</option>
                {bancos.map((banco) => (
                  <option key={banco.id} value={banco.id}>
                    {banco.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-row items-center">
              {/* style={{ display: 'flex', alignItems: 'center' }} */}
              <input
                type="checkbox"
                id="esPrincipalCC"
                name="esPrincipalCC"
                checked={formData.esPrincipalCC ?? true}
                onChange={handleChange}
                className="mr-bd-sm"
                style={{ marginRight: '8px', width: '18px', height: '18px' }}
              />
              <label htmlFor="esPrincipalCC" className="text-bd-muted text-bd-xs">¿Es tarjeta principal?</label>
              {/* style={{ fontWeight: 'bold' }} */}
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-bd-xl justify-end">
          {/* style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }} */}
          <BdButton variant="ghost" onClick={() => router.push('/huespedes')}>
            Cancelar
          </BdButton>
          <BdButton variant="cta" type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Crear Huésped'}
          </BdButton>
        </div>
      </form>
    </div></BdPageLayout>
  );
}
