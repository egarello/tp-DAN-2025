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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-bd-sidebar border-r border-bd-subtle animate-[bd-fade-up_200ms_ease-out]">
      <nav className="flex flex-col gap-1 p-bd-lg">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? 'page' : undefined}
            className={`block px-bd-md py-bd-sm rounded-bd-md text-sm font-semibold transition-colors duration-150 ${pathname === item.href ? 'bg-bd-card-hover text-bd-blue-bright shadow-bd-card' : 'text-bd-secondary hover:bg-bd-card-hover hover:text-bd-blue-bright'}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
