import BdButton from '@/components/BdButton';
import BdCard from '@/components/BdCard';
import BdPageLayout from '@/components/BdPageLayout';

const quickAccess = [
  { href: '/reservas', title: 'Reservas', description: 'Buscar, crear y seguir reservas desde un solo lugar.' },
  { href: '/gestion', title: 'Gestión', description: 'Hoteles, habitaciones, tarifas y estados operativos.' },
  { href: '/huespedes', title: 'Huéspedes', description: 'Alta y administración del perfil de huésped.' },
  { href: '/propietarios/nuevo', title: 'Propietarios', description: 'Registro de propietarios con su cuenta bancaria.' },
  { href: '/usuarios', title: 'Usuarios', description: 'Listado y búsqueda de usuarios del sistema.' },
  { href: '/bancos', title: 'Bancos', description: 'CRUD de bancos para medios de pago.' },
];

export default function Home() {
  return (
    <BdPageLayout>
      <div className="mx-auto mt-8 flex w-full max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[2rem] border border-bd-medium/70 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_40%),linear-gradient(135deg,_rgba(12,18,28,0.96),_rgba(15,23,42,0.88))] px-6 py-16 text-center shadow-bd-card sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.03),transparent)]" />
          <div className="relative flex flex-col items-center space-y-6">
            <span className="inline-flex rounded-full border border-bd-medium/70 bg-bd-card/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-bd-blue-bright">
              Plataforma hotelera modular
            </span>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-bd-primary sm:text-5xl lg:text-6xl">
                Gestión de reservas y hoteles desde un solo lugar.
              </h1>
            </div>

            <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
              <BdButton href="/login" variant="cta">
                Entrar al sistema
              </BdButton>
              <BdButton href="/registro/huesped" variant="ghost">
                Registrar huésped
              </BdButton>
              <BdButton href="/registro/propietario" variant="ghost">
                Registrar propietario
              </BdButton>
            </div>
          </div>
        </section>

      {/* Módulos del Sistema */}
        <section>
        <h2 className="mb-6 text-2xl font-semibold text-bd-primary">Módulos del sistema</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quickAccess.map((item) => (
            <BdCard key={item.href} title={item.title} className="flex flex-col h-full !mt-0">
              {/* flex-grow empuja el botón hacia abajo para mantener alineación */}
              <div className="flex-grow">
                <p className="text-sm leading-6 text-bd-secondary">{item.description}</p>
              </div>
              <div className="mt-6">
                <BdButton href={item.href} variant="ghost" size="sm" className="w-full justify-center">
                  Abrir sección
                </BdButton>
              </div>
            </BdCard>
          ))}
        </div>
      </section>
      </div>
    </BdPageLayout>
  );
}