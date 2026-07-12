'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import ProfileSidebar from '@/components/ProfileSidebar';
import { useAuth } from '@/context/AuthContext';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const isHome = pathname === '/';
  const isAuthRoute = pathname.startsWith('/registro') || pathname.startsWith('/login');

  if (isHome || isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-bd-page text-bd-primary">
      <Topbar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onToggleProfile={() => setProfileOpen((prev) => !prev)}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Mientras AuthContext hidrata la cookie (loading=true), no se renderiza el
            Sidebar/ProfileSidebar: evita el flash de "sin sesión" (ítems públicos,
            "No hay sesión iniciada") en un usuario que en realidad sí está logueado. */}
        {!loading && (
          <>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <ProfileSidebar isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
          </>
        )}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}