'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BdPageLayout from '@/components/BdPageLayout';
import BdCard from '@/components/BdCard';
import BdButton from '@/components/BdButton';
import BdBackLink from '@/components/BdBackLink';

export default function HuespedesPage() {
  const router = useRouter();

  return (
    <BdPageLayout>
      <BdBackLink href="/" className="mb-bd-lg" />
      {/* style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }} */}

      <h1 className="text-bd-primary">Gestión de Huéspedes</h1>

      <div className="flex gap-bd-xl flex-wrap mt-bd-2xl mb-bd-2xl" /* style={{ marginTop: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }} */>
        <BdButton variant="cta" onClick={() => router.push('/huespedes/nuevo')}>
          + Nuevo Huésped
        </BdButton>
        <BdButton variant="primary" onClick={() => router.push('/usuarios')}>
          Ver Todos los Usuarios
        </BdButton>
      </div>

      <BdCard>
        {/* style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }} */}
        <h2 className="text-bd-primary mb-bd-md">Acciones Rápidas</h2>
        <ul className="list-none p-0" /* style={{ lineHeight: '2' }} */>
          <li className="text-bd-secondary leading-relaxed mb-bd-sm">
            <Link href="/huespedes/nuevo" className="text-bd-cta font-semibold">
              Registrar nuevo huésped
            </Link>
          </li>
          <li className="text-bd-secondary leading-relaxed mb-bd-sm">
            <Link href="/usuarios" className="text-bd-link">
              Buscar/listar usuarios existentes
            </Link>
          </li>
        </ul>
      </BdCard>
    </BdPageLayout>
  );
}
