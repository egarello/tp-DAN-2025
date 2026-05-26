'use client';

import Link from 'next/link';

interface BdButtonProps {
  variant?: 'primary' | 'danger' | 'ghost' | 'cta';
  size?: 'sm' | 'md';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export default function BdButton({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  href,
  children,
  className = '',
}: BdButtonProps) {
  const cls = `bd-btn bd-btn-${variant} bd-btn-${size} animate-[bd-fade-up_200ms_ease-out]${disabled ? ' bd-btn-disabled' : ''}${className ? ` ${className}` : ''}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={cls}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
