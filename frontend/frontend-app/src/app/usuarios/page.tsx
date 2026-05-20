'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUsuarios, searchUsuariosByNombre, buscarUsuariosPorDni, Usuario, PageResponse } from '@/lib/api';
import BdPageLayout from '@/components/BdPageLayout';

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchMode, setSearchMode] = useState<'all' | 'nombre' | 'dni'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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

    fetchUsuarios();
  }, [page, searchMode, searchTerm]);

  const handleSearch = (e: React.FormEvent, mode: 'nombre' | 'dni') => {
    e.preventDefault();
    setSearchMode(mode);
    setPage(0);
  };

  return (
    <BdPageLayout>
      <Link href="/" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Inicio
      </Link>

      <h1>Usuarios</h1>

      <div style={{ marginBottom: '30px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '5px' }}>
        <h3>Búsquedas</h3>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setSearchMode('all');
              setSearchTerm('');
              setPage(0);
            }}
            style={{
              padding: '8px 15px',
              backgroundColor: searchMode === 'all' ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Ver Todos
          </button>
          <button
            onClick={() => router.push('/usuarios/buscar-dni-exacto')}
            style={{
              padding: '8px 15px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Buscar por DNI Exacto
          </button>
          <button
            onClick={() => router.push('/bancos')}
            style={{
              padding: '8px 15px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Ver Bancos
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <form
            onSubmit={(e) => handleSearch(e, 'nombre')}
            style={{ display: 'flex', gap: '5px', flex: 1, minWidth: '300px' }}
          >
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={searchMode === 'nombre' ? searchTerm : ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                flex: 1,
              }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Buscar
            </button>
          </form>

          <form
            onSubmit={(e) => handleSearch(e, 'dni')}
            style={{ display: 'flex', gap: '5px', flex: 1, minWidth: '300px' }}
          >
            <input
              type="text"
              placeholder="Buscar por DNI (contiene)"
              value={searchMode === 'dni' ? searchTerm : ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                flex: 1,
              }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {usuarios.length === 0 ? (
            <p>No hay usuarios disponibles</p>
          ) : (
            <table border={1} cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>DNI</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.apellido}</td>
                    <td>{usuario.dni}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.telefono}</td>
                    <td>
                      <button
                        onClick={() => router.push(`/usuarios/${usuario.id}`)}
                        style={{
                          padding: '5px 10px',
                          marginRight: '5px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                        }}
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => router.push(`/huespedes/${usuario.id}`)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                        }}
                      >
                        Como Huésped
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              style={{ padding: '5px 10px', cursor: page === 0 ? 'not-allowed' : 'pointer' }}
            >
              Anterior
            </button>

            <span>
              Página {page + 1} de {totalPages}
            </span>

            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              style={{ padding: '5px 10px', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </BdPageLayout>
  );
}
