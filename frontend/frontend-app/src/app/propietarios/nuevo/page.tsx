'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { crearPropietario, PropietarioRecord, getBancos, Banco } from '@/lib/api';
import BdPageLayout from '@/components/BdPageLayout';
import BdBackLink from '@/components/BdBackLink';
import BdButton from '@/components/BdButton';
import BdAlert from '@/components/BdAlert';

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
    password: '',
    cuentaBancaria: {
      numeroCuenta: '',
      cbu: '',
      alias: '',
      idBanco: 0,
    },
  });
  const [confirmPassword, setConfirmPassword] = useState('');

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

    if (formData.password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

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
    <BdPageLayout>
      <div className="mx-auto max-w-3xl">
        <BdBackLink href="/gestion" className="mb-bd-lg" />

        <h1 className="text-bd-primary text-bd-xl font-bold mb-bd-lg">Nuevo Propietario</h1>

        {error && (
          <BdAlert variant="error" className="mb-bd-lg">
            <strong>Error:</strong> {error}
          </BdAlert>
        )}

        {success && (
          <BdAlert variant="success" className="mb-bd-lg">
            ¡Propietario creado exitosamente! Redirigiendo...
          </BdAlert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-bd-lg">
          <div className="bd-card p-bd-xl">
            <h2 className="text-bd-muted text-bd-xs uppercase tracking-widest mb-bd-lg">Datos del Propietario</h2>

            <div className="grid grid-cols-2 gap-bd-md">
              <div>
                <label htmlFor="nombre" className="text-bd-muted text-bd-xs block mb-bd-xs">Nombre * (mín. 5 caracteres)</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  minLength={5}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="text-bd-muted text-bd-xs block mb-bd-xs">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </div>

              <div>
                <label htmlFor="dni" className="text-bd-muted text-bd-xs block mb-bd-xs">DNI</label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-bd-muted text-bd-xs block mb-bd-xs">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </div>

              <div>
                <label htmlFor="idHotel" className="text-bd-muted text-bd-xs block mb-bd-xs">Hotel asociado</label>
                {/* TODO: SKILL/BRAND no cubren input type="number" — usar Tailwind nativo */}
                <input
                  type="number"
                  id="idHotel"
                  name="idHotel"
                  value={formData.idHotel ?? ''}
                  onChange={handleChange}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-bd-muted text-bd-xs block mb-bd-xs">Contraseña * (mín. 8 caracteres)</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-bd-muted text-bd-xs block mb-bd-xs">Confirmar contraseña *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </div>
            </div>
          </div>

          <div className="bd-card p-bd-xl">
            <h2 className="text-bd-muted text-bd-xs uppercase tracking-widest mb-bd-lg">Cuenta Bancaria *</h2>

            <div className="grid grid-cols-2 gap-bd-md">
              <div>
                <label htmlFor="numeroCuenta" className="text-bd-muted text-bd-xs block mb-bd-xs">Número de Cuenta *</label>
                <input
                  type="text"
                  id="numeroCuenta"
                  name="numeroCuenta"
                  value={formData.cuentaBancaria.numeroCuenta}
                  onChange={handleChange}
                  required
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </div>

              <div>
                <label htmlFor="cbu" className="text-bd-muted text-bd-xs block mb-bd-xs">CBU *</label>
                <input
                  type="text"
                  id="cbu"
                  name="cbu"
                  value={formData.cuentaBancaria.cbu}
                  onChange={handleChange}
                  required
                  maxLength={22}
                  placeholder="1230000000000000000001"
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </div>

              <div>
                <label htmlFor="alias" className="text-bd-muted text-bd-xs block mb-bd-xs">Alias</label>
                <input
                  type="text"
                  id="alias"
                  name="alias"
                  value={formData.cuentaBancaria.alias}
                  onChange={handleChange}
                  placeholder="mi.alias.bancario"
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </div>

              <div>
                <label htmlFor="idBanco" className="text-bd-muted text-bd-xs block mb-bd-xs">Banco *</label>
                <select
                  id="idBanco"
                  name="idBanco"
                  value={formData.cuentaBancaria.idBanco || ''}
                  onChange={handleChange}
                  required
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
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
          </div>

          <div className="flex flex-row gap-bd-xl justify-end">
            <BdButton variant="ghost" onClick={() => router.push('/gestion')}>
              Cancelar
            </BdButton>
            <BdButton variant="cta" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Crear Propietario'}
            </BdButton>
          </div>
        </form>
      </div>
    </BdPageLayout>
  );
}
