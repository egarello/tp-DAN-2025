import NuevoPropietarioPage from '@/app/propietarios/nuevo/page';

export default function RegistroPropietarioPage() {
  return (
    <div className="min-h-screen bg-bd-page">
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[1.5rem] border border-bd-medium/60 bg-bd-card/90 p-6 shadow-bd-card">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-bd-muted">
            Registro de propietario
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-bd-primary sm:text-4xl">
            Administra tu oferta de habitaciones
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-bd-secondary">
            Carga los datos del titular y la cuenta bancaria para empezar a publicar propiedades.
          </p>
        </div>
        <NuevoPropietarioPage />
      </div>
    </div>
  );
}
