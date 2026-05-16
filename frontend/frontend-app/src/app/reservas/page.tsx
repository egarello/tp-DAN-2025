import Link from 'next/link';

const sections = [
  {
    href: '/reservas/lista',
    title: 'Reservas',
    description: 'Listado y detalle de reservas registradas.',
  },
  {
    href: '/reservas/habitaciones',
    title: 'Habitaciones',
    description: 'Habitaciones cacheadas desde gestion-svc.',
  },
];

export default function ReservasLandingPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Inicio
      </Link>

      <h1>Reservas</h1>
      <p>Frontend de solo lectura para el microservicio reservas-svc.</p>

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
    </div>
  );
}