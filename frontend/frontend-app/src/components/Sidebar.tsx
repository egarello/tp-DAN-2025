"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/usuarios", label: "Usuarios" },
  { href: "/bancos", label: "Bancos" },
  { href: "/huespedes", label: "Huéspedes" },
  { href: "/propietarios/nuevo", label: "Propietarios" },
  { href: "/gestion", label: "Gestión" },
  { href: "/reservas", label: "Reservas" },
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-bd-subtle bg-bd-sidebar shadow-bd-card transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-bd-lg py-bd-lg">
          <span className="text-bd-primary text-sm font-semibold uppercase tracking-[0.2em]">
            Navegacion
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-bd-md border border-bd-subtle px-bd-sm py-bd-xs text-bd-muted transition-colors hover:border-bd-medium hover:text-bd-primary"
            aria-label="Cerrar menu"
          >
            ×
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-bd-lg pb-bd-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={pathname === item.href ? 'page' : undefined}
              className={`group flex items-center justify-between rounded-bd-md px-bd-md py-bd-sm text-sm font-semibold transition-all duration-200 ${pathname === item.href ? 'bg-bd-card-hover text-bd-blue-bright shadow-bd-card' : 'text-bd-secondary hover:bg-bd-card-hover hover:text-bd-blue-bright hover:shadow-bd-card'}`}
            >
              <span>{item.label}</span>
              <span className="text-xs text-bd-muted transition-colors group-hover:text-bd-blue-bright">
                →
              </span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
