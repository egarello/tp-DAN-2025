import Link from 'next/link';
import BdPageLayout from '@/components/BdPageLayout';
import BdCard from '@/components/BdCard';
import BdButton from '@/components/BdButton';
import BdBackLink from '@/components/BdBackLink';

const sections = [
  {
    href: '/gestion/hoteles',
    title: 'Hoteles',
    description: 'Listado y detalle de hoteles registrados en gestion-svc.',
  },
  {
    href: '/gestion/habitaciones',
    title: 'Habitaciones',
    description: 'Listado y detalle de habitaciones, hotel y tipo asociado.',
  },
  {
    href: '/gestion/tipos-habitacion',
    title: 'Tipos de Habitación',
    description: 'Listado y detalle de capacidades y descripciones.',
  },
  {
    href: '/gestion/tarifas',
    title: 'Tarifas',
    description: 'Listado y detalle de tarifas por tipo de habitación.',
  },
];

export default function GestionPage() {
  return (
    <BdPageLayout>
      <div className="mx-auto w-full max-w-5xl">
        <BdBackLink href="/" className="mb-bd-lg" />

        <h1 className="text-bd-primary text-bd-xl font-bold">Gestión Hotelera</h1>
        <p className="text-bd-secondary mb-bd-xl">
          Panel de lectura para el microservicio gestion-svc a través del API Gateway.
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
