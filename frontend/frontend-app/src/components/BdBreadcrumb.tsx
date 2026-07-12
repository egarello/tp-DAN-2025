'use client';

import Link from 'next/link';

export interface BdBreadcrumbItem {
  label: string;
  href?: string;
}

interface BdBreadcrumbProps {
  items: BdBreadcrumbItem[];
  className?: string;
}

// Para pantallas de navegación profunda (3+ niveles). El último ítem es la página
// actual y nunca es link, aunque tenga href. Los demás son siempre links.
export default function BdBreadcrumb({ items, className = '' }: BdBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`mb-bd-md flex flex-wrap items-center gap-bd-xs text-bd-sm text-bd-secondary animate-[bd-fade-up_200ms_ease-out]${className ? ` ${className}` : ''}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-bd-xs">
            {index > 0 && <span className="text-bd-muted">/</span>}
            {item.href && !isLast ? (
              <Link href={item.href} className="text-bd-link hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-bd-primary font-semibold' : undefined}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
