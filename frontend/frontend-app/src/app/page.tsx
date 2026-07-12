'use client';

import BdButton from '@/components/BdButton';
import BdPageLayout from '@/components/BdPageLayout';
import { useAuth } from '@/context/AuthContext';
import { HOME_BY_ROL } from '@/lib/auth';

export default function Home() {
  const { user } = useAuth();

  return (
    <BdPageLayout>
      <div className="mx-auto mt-8 flex w-full max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[2rem] border border-bd-medium/70 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_40%),linear-gradient(135deg,_rgba(12,18,28,0.96),_rgba(15,23,42,0.88))] px-6 py-16 text-center shadow-bd-card sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.03),transparent)]" />
          <div className="relative flex flex-col items-center space-y-6">
            <span className="inline-flex rounded-full border border-bd-medium/70 bg-bd-card/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-bd-blue-bright">
              Plataforma hotelera
            </span>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-bd-primary sm:text-5xl lg:text-6xl">
                Gestión de reservas y hoteles desde un solo lugar.
              </h1>
            </div>

            <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
              {user ? (
                <BdButton href={HOME_BY_ROL[user.rol] || '/'} variant="cta">
                  Ir a mi panel
                </BdButton>
              ) : (
                <>
                  <BdButton href="/login" variant="cta">
                    Entrar al sistema
                  </BdButton>
                  <BdButton href="/registro/huesped" variant="ghost">
                    Registrar huésped
                  </BdButton>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </BdPageLayout>
  );
}
