export default function BdPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-bd-xl animate-[bd-fade-up_200ms_ease-out]">{children}</div>
  );
}
