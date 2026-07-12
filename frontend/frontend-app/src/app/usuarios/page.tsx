'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUsuarios, searchUsuariosByNombre, buscarUsuariosPorDni, eliminarHuespedPorDni, Usuario, PageResponse } from '@/lib/api';
import BdPageLayout from '@/components/BdPageLayout';
import BdCard from '@/components/BdCard';
import BdButton from '@/components/BdButton';
import BdBackLink from '@/components/BdBackLink';
import BdPagination from '@/components/BdPagination';
import BdAlert from '@/components/BdAlert';
import BdTable from '@/components/BdTable';

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchMode, setSearchMode] = useState<'all' | 'nombre' | 'dni'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingDni, setDeletingDni] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      let data: PageResponse<Usuario>;

      if (searchMode === 'nombre' && searchTerm) {
        data = await searchUsuariosByNombre(searchTerm, page, 10);
      } else if (searchMode === 'dni' && searchTerm) {
        data = await buscarUsuariosPorDni(searchTerm, page, 10);
      } else {
        data = await getUsuarios(undefined, page, 10);
      }

      setUsuarios(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchMode, searchTerm]);

  const handleSearch = (e: React.FormEvent, mode: 'nombre' | 'dni') => {
    e.preventDefault();
    setSearchMode(mode);
    setPage(0);
  };

  const handleVer = (usuario: Usuario) => {
    router.push(usuario.tipo === 'PROPIETARIO' ? `/usuarios/${usuario.id}` : `/huespedes/${usuario.id}`);
  };

  const handleEliminar = async (usuario: Usuario) => {
    const confirmed = window.confirm(`¿Eliminar definitivamente al huésped ${usuario.nombre} con DNI ${usuario.dni}?`);
    if (!confirmed) return;

    try {
      setError(null);
      setDeletingDni(usuario.dni);
      await eliminarHuespedPorDni(usuario.dni);
      await fetchUsuarios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el huésped');
    } finally {
      setDeletingDni(null);
    }
  };

  return (
    <BdPageLayout>
      <BdBackLink href="/" className="mb-bd-lg" />
      {/* style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }} */}

      <h1 className="text-bd-primary">Usuarios</h1>

      <BdCard className="mb-bd-2xl">
        {/* style={{ marginBottom: '30px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '5px' }} */}
        <h3 className="text-bd-primary mb-bd-md">Búsquedas</h3>
        <div className="flex gap-bd-lg mb-bd-lg flex-wrap" /* style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }} */>
          <BdButton
            variant={searchMode === 'all' ? 'primary' : 'ghost'}
            onClick={() => {
              setSearchMode('all');
              setSearchTerm('');
              setPage(0);
            }}
          >
            Ver Todos
          </BdButton>
          <BdButton variant="primary" onClick={() => router.push('/usuarios/buscar-dni-exacto')}>
            Buscar por DNI Exacto
          </BdButton>
          <BdButton variant="primary" onClick={() => router.push('/bancos')}>
            Ver Bancos
          </BdButton>
        </div>

        <div className="flex gap-bd-sm flex-wrap" /* style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} */>
          <form
            onSubmit={(e) => handleSearch(e, 'nombre')}
            className="flex gap-bd-xs flex-1 min-w-[300px]"
            /* style={{ display: 'flex', gap: '5px', flex: 1, minWidth: '300px' }} */
          >
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={searchMode === 'nombre' ? searchTerm : ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-bd-input text-bd-primary border-bd-input rounded-bd-md p-bd-sm flex-1"
              /* style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }} */
            />
            <BdButton variant="primary" type="submit">
              Buscar
            </BdButton>
          </form>

          <form
            onSubmit={(e) => handleSearch(e, 'dni')}
            className="flex gap-bd-xs flex-1 min-w-[300px]"
            /* style={{ display: 'flex', gap: '5px', flex: 1, minWidth: '300px' }} */
          >
            <input
              type="text"
              placeholder="Buscar por DNI (contiene)"
              value={searchMode === 'dni' ? searchTerm : ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-bd-input text-bd-primary border-bd-input rounded-bd-md p-bd-sm flex-1"
              /* style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }} */
            />
            <BdButton variant="primary" type="submit">
              Buscar
            </BdButton>
          </form>
        </div>
      </BdCard>

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
          {usuarios.length === 0 ? (
            <p className="text-bd-secondary">No hay usuarios disponibles</p>
          ) : (
            <BdTable>
              <table className="bd-table w-full mt-bd-xl" border={1} cellPadding="10" /* style={{ width: '100%', marginTop: '20px' }} */>
                <thead>
                  <tr>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Nombre</th>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Apellido</th>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">DNI</th>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Email</th>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Teléfono</th>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Tipo</th>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{usuario.nombre}</td>
                      <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{usuario.apellido}</td>
                      <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{usuario.dni}</td>
                      <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{usuario.email}</td>
                      <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{usuario.telefono}</td>
                      <td className="p-bd-md border-b border-bd-subtle">
                        <span className="inline-flex rounded-full border border-bd-subtle px-bd-sm py-bd-xs text-xs uppercase tracking-wide text-bd-blue-bright">
                          {usuario.tipo === 'PROPIETARIO' ? 'Propietario' : 'Huésped'}
                        </span>
                      </td>
                      <td className="p-bd-md border-b border-bd-subtle bd-row-actions">
                        <BdButton variant="ghost" size="sm" onClick={() => handleVer(usuario)}>
                          Ver
                        </BdButton>
                        {usuario.tipo !== 'PROPIETARIO' && (
                          <BdButton
                            variant="danger"
                            size="sm"
                            onClick={() => handleEliminar(usuario)}
                            disabled={deletingDni === usuario.dni}
                            className="ml-2"
                          >
                            {deletingDni === usuario.dni ? 'Eliminando...' : 'Eliminar'}
                          </BdButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </BdTable>
          )}

          {totalPages > 0 && (
            <BdPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </BdPageLayout>
  );
}
