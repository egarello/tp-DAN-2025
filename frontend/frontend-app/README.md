# Frontend Hotel Management System

Frontend de la aplicación de gestión hotelera construida con Next.js 16.2.4 y React 19.2.4.

## Stack Tecnológico

- **Next.js 16.2.4** - React framework con App Router
- **React 19.2.4** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **Node.js 22 Alpine** - Runtime de producción en Docker

## Desarrollo Local

### Requisitos
- Node.js 22+
- [pnpm 11](https://pnpm.io/11.x/installation) (vía Corepack: `corepack enable`)

### Instalación

```bash
# Instalar dependencias
pnpm install

# Ejecutar servidor de desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

El servidor se recargará automáticamente cuando edites archivos.

### Comandos Disponibles

```bash
# Desarrollo
pnpm dev

# Build para producción
pnpm build

# Ejecutar versión de producción
pnpm start

# Linter
pnpm lint
```

## Docker

### Construcción de imagen

```bash
# Desde la raíz del proyecto
docker build -f frontend/frontend-app/Dockerfile -t frontend-app:latest .

# O desde la carpeta del frontend
cd frontend/frontend-app
docker build -t frontend-app:latest .
```

### Ejecutar contenedor

```bash
# Ejecutar en modo interactivo
docker run -it -p 3000:3000 frontend-app:latest

# Ejecutar en background
docker run -d -p 3000:3000 --name frontend frontend-app:latest

# Ver logs
docker logs -f frontend

# Detener
docker stop frontend
```

### Con Docker Compose

```bash
# Desde la raíz del proyecto
docker compose -f infra/docker-compose.yml up frontend

# O todos los servicios
docker compose -f infra/docker-compose.yml up

# Detener
docker compose -f infra/docker-compose.yml down
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx       - Root layout
│   ├── page.tsx         - Home page
│   └── globals.css      - Global styles
├── components/          - (A crear) Componentes reutilizables
├── pages/              - (A crear) Páginas
├── lib/                - (A crear) Utilidades
└── types/              - (A crear) TypeScript types
```

## Configuración

### Alias de importes

Usa `@/` para importar desde `src/`:

```typescript
// En lugar de: import Component from '../../../components/Component'
import Component from '@/components/Component'
```

## Puerto

- **Desarrollo**: `http://localhost:3000`
- **Producción (Docker)**: `http://localhost:3000`

## Healthcheck

El contenedor Docker incluye un healthcheck que verifica que la aplicación esté respondiendo en puerto 3000.

## Más Información

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)
