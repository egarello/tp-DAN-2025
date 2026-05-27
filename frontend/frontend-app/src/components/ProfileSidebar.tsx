"use client";

import { useEffect } from "react";

type ProfileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-72 flex-col border-l border-bd-subtle bg-bd-sidebar shadow-bd-card transition-transform duration-200 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-bd-lg py-bd-lg">
          <span className="text-bd-primary text-sm font-semibold uppercase tracking-[0.2em]">
            Perfil
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-bd-md border border-bd-subtle px-bd-sm py-bd-xs text-bd-muted transition-colors hover:border-bd-medium hover:text-bd-primary"
            aria-label="Cerrar perfil"
          >
            ×
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-bd-md px-bd-lg pb-bd-lg text-bd-secondary">
          <p className="text-sm">A implementar.</p>
        </div>
      </aside>
    </>
  );
}
