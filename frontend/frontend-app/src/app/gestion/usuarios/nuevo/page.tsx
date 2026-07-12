import NuevoPropietarioPage from '@/app/propietarios/nuevo/page';

// Antes esto era /registro/propietario, público. Como Propietario ahora tiene acceso
// total a la plataforma, el alta deja de ser auto-registro: solo un Propietario ya
// logueado puede crear otras cuentas Propietario (protegido por middleware.ts, que
// gatea todo /gestion/** a rol PROPIETARIO).
export default function NuevoUsuarioPropietarioPage() {
  return (
    <div className="min-h-screen bg-bd-page">
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[1.5rem] border border-bd-medium/60 bg-bd-card/90 p-6 shadow-bd-card">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-bd-muted">
            Alta de propietario
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-bd-primary sm:text-4xl">
            Crear una nueva cuenta de Propietario
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-bd-secondary">
            Solo un Propietario ya logueado puede dar de alta otras cuentas con acceso a la administración de la plataforma.
          </p>
        </div>
        <NuevoPropietarioPage />
      </div>
    </div>
  );
}
