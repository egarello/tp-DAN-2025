import Link from 'next/link';
import BdPageLayout from '@/components/BdPageLayout';
import BdCard from '@/components/BdCard';
import BdButton from '@/components/BdButton';
import BdBackLink from '@/components/BdBackLink';

const sections = [
  {
    href: '/reservas/lista',
    title: 'Reservas',
    description: 'Listado, detalle y creación de reservas.',
  },
  {
    href: '/reservas/nueva',
    title: 'Nueva Reserva',
    description: 'Crear una nueva reserva.',
  },
  {
    href: '/reservas/habitaciones',
    title: 'Habitaciones',
    description: 'Habitaciones cacheadas desde gestion-svc.',
  },
];

export default function ReservasLandingPage() {
  return (
    <BdPageLayout>
      <div className="mx-auto w-full max-w-5xl">
        <BdBackLink href="/" className="mb-bd-lg" />

        <h1 className="text-bd-primary text-bd-xl font-bold">Reservas</h1>
        <p className="text-bd-secondary mb-bd-xl">
          Panel de acceso al microservicio reservas-svc.
        </p>

        <div className="grid gap-bd-lg sm:grid-cols-2">
          {sections.map((section) => (
            <BdCard key={section.href} title={section.title} className="flex flex-col h-full">
              <p className="text-bd-secondary text-sm leading-6">{section.description}</p>
              <div className="mt-bd-lg">
                <BdButton href={section.href} variant="ghost" size="sm">
                  Abrir modulo
                </BdButton>
              </div>
            </BdCard>
          ))}
        </div>
      </div>
    </BdPageLayout>
  );
}