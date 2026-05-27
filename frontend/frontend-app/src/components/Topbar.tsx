import Link from 'next/link';

type TopbarProps = {
  onToggleSidebar?: () => void;
  onToggleProfile?: () => void;
};

export default function Topbar({ onToggleSidebar, onToggleProfile }: TopbarProps) {
  return (
    <header className="h-14 flex items-center justify-between px-bd-lg bg-[linear-gradient(135deg,rgba(16,27,40,0.95),rgba(15,25,40,0.9))] shrink-0 animate-[bd-fade-up_200ms_ease-out]">
      <div className="flex items-center gap-bd-md">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-bd-md border border-bd-subtle px-bd-sm py-bd-xs text-bd-muted transition-colors hover:border-bd-medium hover:text-bd-primary"
          aria-label="Abrir menu"
        >
          ☰
        </button>
        <Link href="/" className="text-bd-blue-bright font-bold text-bd-xl tracking-wide">
          DAN Hoteles
        </Link>
        <span className="text-bd-muted text-bd-xs uppercase tracking-[0.2em]">
          Plataforma de hoteles
        </span>
      </div>
      <button
        type="button"
        onClick={onToggleProfile}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-bd-subtle text-bd-muted transition-colors hover:border-bd-medium hover:text-bd-primary"
        aria-label="Perfil"
      >
        <span aria-hidden="true">👤</span>
      </button>
    </header>
  );
}
