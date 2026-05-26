import Link from 'next/link';
import BdPageLayout from '@/components/BdPageLayout';

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
      <Link href="/" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Inicio
      </Link>

      <h1>Gestión Hotelera</h1>
      <p>Frontend de solo lectura para el microservicio gestion-svc a través del API Gateway.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '24px' }}>
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '18px',
              textDecoration: 'none',
              color: 'inherit',
              backgroundColor: '#f8f9fa',
            }}
          >
            <h2 style={{ marginTop: 0 }}>{section.title}</h2>
            <p style={{ marginBottom: 0 }}>{section.description}</p>
          </Link>
        ))}
      </div>
    </BdPageLayout>
  );
}
