'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBancos, Banco, PageResponse } from '@/lib/api';
import BdPageLayout from '@/components/BdPageLayout';
import BdCard from '@/components/BdCard';
import BdButton from '@/components/BdButton';
import BdBackLink from '@/components/BdBackLink';
import BdPagination from '@/components/BdPagination';
import BdAlert from '@/components/BdAlert';
import BdTable from '@/components/BdTable';

export default function BancosPage() {
  const router = useRouter();
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBancos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: PageResponse<Banco> = await getBancos(page, 10);
        setBancos(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBancos();
  }, [page]);

  return (
    <BdPageLayout>
      <BdBackLink href="/" className="mb-bd-lg" />
      {/* style={{ padding: '8px 16px', marginBottom: '20px', cursor: 'pointer' }} */}

      <h1 className="text-bd-primary">Bancos</h1>

      {error && (
        <BdAlert variant="error">
          {/* style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }} */}
          <strong>Error:</strong> {error}
        </BdAlert>
      )}

      {loading ? (
        <div className="bd-skeleton bd-skeleton-text" />
      ) : (
        <>
          {bancos.length === 0 ? (
            <p className="text-bd-secondary">No hay bancos disponibles</p>
          ) : (
            <BdTable>
              <table className="bd-table w-full mt-bd-xl" border={1} cellPadding="10" /* style={{ width: '100%', marginTop: '20px' }} */>
                <thead>
                  <tr>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Nombre</th>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Código</th>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {bancos.map((banco) => (
                    <tr key={banco.id}>
                      <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{banco.nombre}</td>
                      <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{banco.codigo}</td>
                      <td className="p-bd-md border-b border-bd-subtle bd-row-actions">
                        <BdButton variant="ghost" size="sm" onClick={() => router.push(`/bancos/${banco.id}`)}>
                          Ver
                        </BdButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </BdTable>
          )}

          <BdPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </BdPageLayout>
  );
}
