'use client';

interface BdTableProps {
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}

function RowActions({ children }: { children: React.ReactNode }) {
  return <div className="bd-table-row-actions">{children}</div>;
}

export default function BdTable({ toolbar, children }: BdTableProps) {
  return (
    <div className="bd-table-wrap animate-[bd-fade-up_200ms_ease-out]">
      {toolbar && <div className="bd-table-toolbar">{toolbar}</div>}
      {children}
    </div>
  );
}

BdTable.RowActions = RowActions;
