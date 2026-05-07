'use client';

import { useRouter } from 'next/navigation';

export default function HuespedesPage() {
  const router = useRouter();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <a href="/" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Inicio
      </a>

      <h1>Gestión de Huéspedes</h1>

      <div style={{ marginTop: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => router.push('/huespedes/nuevo')}
          style={{
            padding: '15px 25px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: 'bold',
          }}
        >
          + Nuevo Huésped
        </button>
        <button
          onClick={() => router.push('/usuarios')}
          style={{
            padding: '15px 25px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1em',
          }}
        >
          Ver Todos los Usuarios
        </button>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Acciones Rápidas</h2>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <a href="/huespedes/nuevo" style={{ color: '#28a745', fontWeight: 'bold' }}>
              Registrar nuevo huésped
            </a>
          </li>
          <li>
            <a href="/usuarios" style={{ color: '#007bff' }}>
              Buscar/listar usuarios existentes
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}