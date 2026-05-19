---
name: booking-dark
version: 1.0.0
description: >
  Sistema de tokens y componentes inspirado en el design system BUI de Booking.com,
  adaptado para dark mode y enriquecido con un animation layer. Produce layouts de
  listado de items (tarjetas horizontales), filtros, badges y CTAs listos para
  producción. Tokenizable: todos los valores están en custom properties CSS.
tags: [dark-mode, listing, cards, animations, tokens, booking-ui]
---

# Booking Dark — Design System Skill

Sistema de diseño tokenizado inspirado en BUI (Booking UI), reconvertido en dark mode
con una capa de animaciones que aumenta la interactividad sin perder la claridad
funcional del original.

---

## 1. Cómo usar este skill

1. Copia el bloque `:root` de tokens a tu hoja de estilos o en un `<style>` global.
2. Usa las clases utilitarias y los snippets de componentes de las secciones 3–6.
3. Ajusta únicamente los tokens de la sección 2 para cambiar tema, densidad o brand.
4. El animation layer (sección 7) es opt-in: agrega la clase `.bd-animated` al
   contenedor raíz para activar todas las animaciones de golpe.

---

## 2. Token Map — CSS Custom Properties

```css
/* ============================================================
   BOOKING-DARK TOKENS — pegar en :root o en un selector padre
   ============================================================ */

@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
  
:root {

  /* --- SURFACE --- */
  --bd-bg-page:        #0b1423;   /* fondo de página / cuerpo */
  --bd-bg-card:        #162032;   /* tarjetas y paneles */
  --bd-bg-card-hover:  #1c2a40;   /* tarjeta al pasar el cursor */
  --bd-bg-overlay:     #0d1928cc; /* modales y drawers (con alpha) */
  --bd-bg-input:       #1a2840;   /* inputs y selects */
  --bd-bg-sidebar:     #111e30;   /* barra lateral de filtros */
  --bd-bg-skeleton:    #1e2d42;   /* placeholder de carga */

  /* --- BRAND / INTERACTIVE --- */
  --bd-blue-bright:    #4fa3f7;   /* links, iconos interactivos */
  --bd-blue-cta:       #1a73e8;   /* botón primario (CTA) */
  --bd-blue-cta-hover: #1557c0;   /* hover del botón primario */
  --bd-blue-badge:     #1565c0;   /* fondo badge de review score */
  --bd-blue-badge-txt: #ddeeff;   /* texto sobre badge azul */

  /* --- TEXTO --- */
  --bd-text-primary:   #e8ecf4;   /* títulos, valores */
  --bd-text-secondary: #8b9bb4;   /* subtítulos, metadatos */
  --bd-text-muted:     #4f6080;   /* placeholders, desactivados */
  --bd-text-link:      #4fa3f7;   /* enlaces */
  --bd-text-inverse:   #ffffff;   /* texto sobre fondos sólidos */

  /* --- BORDES --- */
  --bd-border-subtle:  rgba(255,255,255,0.07);  /* bordes de tarjeta */
  --bd-border-medium:  rgba(255,255,255,0.13);  /* hover de tarjeta */
  --bd-border-input:   rgba(255,255,255,0.15);  /* inputs */
  --bd-border-focus:   #4fa3f7;                 /* foco / outline */

  /* --- SEMÁNTICOS --- */
  --bd-green-deal:     #1b5e35;   /* fondo "Oferta Genius" */
  --bd-green-deal-txt: #6fcf97;   /* texto sobre fondo verde */
  --bd-green-free:     #27ae60;   /* "Cancelación gratuita" */
  --bd-yellow-star:    #ffb700;   /* estrellas de categoría */
  --bd-red-urgency:    #c0392b;   /* "¡Solo quedan 2!" */
  --bd-amber-promo:    #e67e22;   /* badges de promoción */

  /* --- TIPOGRAFÍA --- */
  --bd-font-sans:      -apple-system, BlinkMacSystemFont, "Inter",
                       Roboto, "Helvetica Neue", Arial, sans-serif;
  --bd-fs-xl:          1.25rem;   /* 20px — título de tarjeta */
  --bd-fs-lg:          1.0625rem; /* 17px — subtítulo */
  --bd-fs-md:          0.9375rem; /* 15px — body */
  --bd-fs-sm:          0.8125rem; /* 13px — metadatos */
  --bd-fs-xs:          0.6875rem; /* 11px — labels, chips */

  /* --- ESPACIADO --- */
  --bd-space-xs:  4px;
  --bd-space-sm:  8px;
  --bd-space-md:  12px;
  --bd-space-lg:  16px;
  --bd-space-xl:  24px;
  --bd-space-2xl: 32px;

  /* --- RADIOS --- */
  --bd-radius-sm:   4px;   /* chips pequeños */
  --bd-radius-md:   6px;   /* badges, inputs */
  --bd-radius-card: 8px;   /* tarjetas */
  --bd-radius-pill: 20px;  /* pills de filtro */
  --bd-radius-full: 9999px;/* score circular */

  /* --- IMÁGENES (thumbnail de tarjeta) --- */
  --bd-img-w:  220px;       /* ancho thumbnail desktop */
  --bd-img-w-sm: 120px;     /* ancho thumbnail mobile */
  --bd-img-ratio: 66%;      /* aspect-ratio padding trick (3:2) */

  /* --- SOMBRAS --- */
  --bd-shadow-card:       0 2px 8px rgba(0,0,0,0.45);
  --bd-shadow-card-hover: 0 8px 24px rgba(0,0,0,0.65);
  --bd-shadow-cta:        0 4px 12px rgba(26,115,232,0.4);

  /* --- ANIMACIONES --- */
  --bd-duration-fast:   150ms;
  --bd-duration-base:   250ms;
  --bd-duration-slow:   400ms;
  --bd-ease-out:        cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --bd-ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1.0);
  --bd-ease-enter:      cubic-bezier(0.0, 0.0, 0.2, 1.0);

  /* --- Z-INDEX --- */
  --bd-z-card:    1;
  --bd-z-badge:   2;
  --bd-z-tooltip: 10;
  --bd-z-modal:   100;
}
```

---

## 3. Reset mínimo + base tipográfica

```css
/* Base recomendada para un layout booking-dark */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--bd-font-sans);
  font-size: var(--bd-fs-md);
  color: var(--bd-text-primary);
  background: var(--bd-bg-page);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--bd-text-link);
  text-decoration: none;
}
a:hover { text-decoration: underline; }

img { display: block; max-width: 100%; }

button, input, select {
  font-family: inherit;
  font-size: inherit;
}
```

---

## 4. Componente: Listing Card (tarjeta horizontal)

La tarjeta canónica de Booking.com: imagen izquierda, info + precio a la derecha.

```html
<!-- DATA-ATTRS: todos los valores son attr del elemento raíz,
     lo que lo hace fácil de generar dinámicamente o via template. -->
<article class="bd-card bd-animated"
         data-id="hotel-123"
         aria-label="Hotel Sunrise Palace">

  <!-- Thumbnail con badge de deal (opcional) -->
  <div class="bd-card__thumb">
    <img src="hotel.jpg" alt="Vista del Hotel Sunrise Palace" loading="lazy">
    <span class="bd-badge bd-badge--deal">Genius</span>
  </div>

  <!-- Cuerpo informativo -->
  <div class="bd-card__body">

    <!-- Fila 1: nombre + stars + tipo -->
    <header class="bd-card__header">
      <div>
        <h3 class="bd-card__name">Hotel Sunrise Palace</h3>
        <div class="bd-stars" aria-label="4 estrellas" role="img">
          <!-- Repite el span N veces según categoría -->
          <span class="bd-stars__star"></span>
          <span class="bd-stars__star"></span>
          <span class="bd-stars__star"></span>
          <span class="bd-stars__star"></span>
        </div>
      </div>
      <!-- Score de reseñas -->
      <div class="bd-score">
        <span class="bd-score__value">9.2</span>
        <div class="bd-score__meta">
          <span class="bd-score__label">Excepcional</span>
          <span class="bd-score__count">2 341 reseñas</span>
        </div>
      </div>
    </header>

    <!-- Fila 2: ubicación + distancia -->
    <p class="bd-card__location">
      <span class="bd-icon bd-icon--pin" aria-hidden="true"></span>
      Centro histórico · a 300 m del centro
      <a href="#map" class="bd-link--map">Ver en el mapa</a>
    </p>

    <!-- Fila 3: chips de amenidades -->
    <ul class="bd-chips" aria-label="Amenidades incluidas">
      <li class="bd-chip">WiFi gratis</li>
      <li class="bd-chip">Desayuno</li>
      <li class="bd-chip">Pileta</li>
      <li class="bd-chip">Estacionamiento</li>
    </ul>

    <!-- Fila 4: tags semánticos (cancelación, últimas habitaciones...) -->
    <ul class="bd-tags" aria-label="Condiciones">
      <li class="bd-tag bd-tag--free">Cancelación gratuita</li>
      <li class="bd-tag bd-tag--urgency">¡Solo quedan 2 habitaciones!</li>
    </ul>

    <!-- Fila 5: bloque de precio + CTA -->
    <footer class="bd-card__footer">
      <div class="bd-price">
        <span class="bd-price__original">ARS 85 000</span>
        <span class="bd-price__current">ARS 63 750</span>
        <span class="bd-price__note">por noche · impuestos incluidos</span>
      </div>
      <button class="bd-cta" type="button">
        Ver disponibilidad
      </button>
    </footer>

  </div>
</article>
```

### CSS de la tarjeta

```css
/* ---- Contenedor ---- */
.bd-card {
  display: flex;
  background: var(--bd-bg-card);
  border: 1px solid var(--bd-border-subtle);
  border-radius: var(--bd-radius-card);
  overflow: hidden;
  box-shadow: var(--bd-shadow-card);
  transition:
    transform    var(--bd-duration-base) var(--bd-ease-out),
    box-shadow   var(--bd-duration-base) var(--bd-ease-out),
    border-color var(--bd-duration-base) var(--bd-ease-out),
    background   var(--bd-duration-base) var(--bd-ease-out);
}
.bd-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--bd-shadow-card-hover);
  border-color: var(--bd-border-medium);
  background: var(--bd-bg-card-hover);
}

/* ---- Thumbnail ---- */
.bd-card__thumb {
  position: relative;
  flex-shrink: 0;
  width: var(--bd-img-w);
  overflow: hidden;
}
.bd-card__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--bd-duration-slow) var(--bd-ease-out);
}
.bd-card:hover .bd-card__thumb img {
  transform: scale(1.05);
}

/* ---- Body ---- */
.bd-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--bd-space-lg);
  gap: var(--bd-space-sm);
}

/* ---- Header (nombre + score) ---- */
.bd-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--bd-space-md);
}
.bd-card__name {
  font-size: var(--bd-fs-xl);
  font-weight: 700;
  color: var(--bd-text-primary);
  line-height: 1.2;
}

/* ---- Estrellas ---- */
.bd-stars {
  display: flex;
  gap: 2px;
  margin-top: 4px;
}
.bd-stars__star {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: var(--bd-yellow-star);
  clip-path: polygon(50% 0%,61% 35%,98% 35%,68% 57%,
                     79% 91%,50% 70%,21% 91%,32% 57%,
                     2% 35%,39% 35%);
}

/* ---- Score badge ---- */
.bd-score {
  display: flex;
  align-items: center;
  gap: var(--bd-space-sm);
  flex-shrink: 0;
}
.bd-score__value {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bd-blue-badge);
  color: var(--bd-blue-badge-txt);
  font-size: var(--bd-fs-lg);
  font-weight: 700;
  border-radius: var(--bd-radius-md) var(--bd-radius-md)
                 var(--bd-radius-md) 0;  /* esquina BUI clásica */
  flex-shrink: 0;
}
.bd-score__meta {
  display: flex;
  flex-direction: column;
}
.bd-score__label {
  font-size: var(--bd-fs-sm);
  font-weight: 600;
  color: var(--bd-text-primary);
}
.bd-score__count {
  font-size: var(--bd-fs-xs);
  color: var(--bd-text-secondary);
}

/* ---- Ubicación ---- */
.bd-card__location {
  font-size: var(--bd-fs-sm);
  color: var(--bd-text-secondary);
}
.bd-link--map {
  margin-left: var(--bd-space-xs);
  color: var(--bd-text-link);
  font-weight: 500;
}

/* ---- Chips (amenidades) ---- */
.bd-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bd-space-xs);
  list-style: none;
}
.bd-chip {
  font-size: var(--bd-fs-xs);
  padding: 3px var(--bd-space-sm);
  border: 1px solid var(--bd-border-input);
  border-radius: var(--bd-radius-pill);
  color: var(--bd-text-secondary);
  transition:
    border-color var(--bd-duration-fast) var(--bd-ease-out),
    color        var(--bd-duration-fast) var(--bd-ease-out),
    background   var(--bd-duration-fast) var(--bd-ease-out);
}
.bd-chip:hover {
  border-color: var(--bd-blue-bright);
  color: var(--bd-blue-bright);
  background: rgba(79,163,247,0.08);
  cursor: default;
}

/* ---- Tags semánticos ---- */
.bd-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bd-space-xs);
  list-style: none;
}
.bd-tag {
  font-size: var(--bd-fs-xs);
  font-weight: 600;
  padding: 2px var(--bd-space-sm);
  border-radius: var(--bd-radius-sm);
}
.bd-tag--free    { color: var(--bd-green-free); }
.bd-tag--urgency { color: var(--bd-red-urgency); }
.bd-tag--promo   {
  background: rgba(230,126,34,0.15);
  color: var(--bd-amber-promo);
}

/* ---- Footer: precio + CTA ---- */
.bd-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
  padding-top: var(--bd-space-sm);
  border-top: 1px solid var(--bd-border-subtle);
}
.bd-price {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.bd-price__original {
  font-size: var(--bd-fs-xs);
  color: var(--bd-text-muted);
  text-decoration: line-through;
}
.bd-price__current {
  font-size: var(--bd-fs-xl);
  font-weight: 700;
  color: var(--bd-text-primary);
}
.bd-price__note {
  font-size: var(--bd-fs-xs);
  color: var(--bd-text-secondary);
}

/* ---- CTA Button ---- */
.bd-cta {
  padding: var(--bd-space-sm) var(--bd-space-lg);
  background: var(--bd-blue-cta);
  color: var(--bd-text-inverse);
  font-size: var(--bd-fs-md);
  font-weight: 700;
  border: none;
  border-radius: var(--bd-radius-md);
  cursor: pointer;
  white-space: nowrap;
  box-shadow: var(--bd-shadow-cta);
  transition:
    background  var(--bd-duration-fast) var(--bd-ease-out),
    transform   var(--bd-duration-fast) var(--bd-ease-spring),
    box-shadow  var(--bd-duration-fast) var(--bd-ease-out);
}
.bd-cta:hover {
  background: var(--bd-blue-cta-hover);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 18px rgba(26,115,232,0.55);
}
.bd-cta:active {
  transform: translateY(0) scale(0.98);
  box-shadow: none;
}

/* ---- Badge de deal (sobre thumbnail) ---- */
.bd-badge {
  position: absolute;
  top: var(--bd-space-sm);
  left: var(--bd-space-sm);
  font-size: var(--bd-fs-xs);
  font-weight: 700;
  padding: 3px var(--bd-space-sm);
  border-radius: var(--bd-radius-sm);
  z-index: var(--bd-z-badge);
}
.bd-badge--deal {
  background: var(--bd-green-deal);
  color: var(--bd-green-deal-txt);
}
.bd-badge--promo {
  background: rgba(230,126,34,0.9);
  color: #fff;
}

/* ---- Responsive (mobile) ---- */
@media (max-width: 640px) {
  .bd-card { flex-direction: column; }
  .bd-card__thumb {
    width: 100%;
    height: 180px;
  }
}
```

---

## 5. Componente: Lista de tarjetas (wrapper)

```html
<section class="bd-listing" aria-label="Resultados de búsqueda">
  <!-- Aquí van los <article class="bd-card"> -->
</section>
```

```css
.bd-listing {
  display: flex;
  flex-direction: column;
  gap: var(--bd-space-lg);
  padding: var(--bd-space-xl) 0;
}
```

---

## 6. Componente: Sidebar de filtros

```html
<aside class="bd-sidebar" aria-label="Filtros de búsqueda">

  <!-- Filter group reutilizable -->
  <div class="bd-filter-group">
    <h4 class="bd-filter-group__title">Presupuesto por noche</h4>
    <ul class="bd-filter-list">
      <li class="bd-filter-item">
        <label class="bd-filter-label">
          <input type="checkbox" class="bd-filter-check">
          <span class="bd-filter-text">Menos de ARS 40 000</span>
          <span class="bd-filter-count">48</span>
        </label>
      </li>
      <!-- ... más items ... -->
    </ul>
  </div>

  <div class="bd-filter-group">
    <h4 class="bd-filter-group__title">Puntuación de reseñas</h4>
    <ul class="bd-filter-list">
      <li class="bd-filter-item">
        <label class="bd-filter-label">
          <input type="checkbox" class="bd-filter-check">
          <span class="bd-filter-text">Excepcional: 9+</span>
        </label>
      </li>
    </ul>
  </div>

</aside>
```

```css
.bd-sidebar {
  width: 260px;
  flex-shrink: 0;
  background: var(--bd-bg-sidebar);
  border: 1px solid var(--bd-border-subtle);
  border-radius: var(--bd-radius-card);
  padding: var(--bd-space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--bd-space-xl);
}

.bd-filter-group__title {
  font-size: var(--bd-fs-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--bd-text-muted);
  margin-bottom: var(--bd-space-sm);
}

.bd-filter-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }

.bd-filter-label {
  display: flex;
  align-items: center;
  gap: var(--bd-space-sm);
  cursor: pointer;
  padding: 4px var(--bd-space-sm);
  border-radius: var(--bd-radius-md);
  transition: background var(--bd-duration-fast) var(--bd-ease-out);
}
.bd-filter-label:hover { background: rgba(255,255,255,0.05); }

.bd-filter-check {
  appearance: none;
  width: 16px;
  height: 16px;
  border: 1.5px solid var(--bd-border-input);
  border-radius: 3px;
  flex-shrink: 0;
  cursor: pointer;
  transition:
    background     var(--bd-duration-fast) var(--bd-ease-out),
    border-color   var(--bd-duration-fast) var(--bd-ease-out);
}
.bd-filter-check:checked {
  background: var(--bd-blue-cta);
  border-color: var(--bd-blue-cta);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23fff' d='M13.5 3.5L6 11 2.5 7.5l-1 1L6 13l8.5-8.5z'/%3E%3C/svg%3E");
  background-size: 12px;
  background-repeat: no-repeat;
  background-position: center;
}

.bd-filter-text {
  flex: 1;
  font-size: var(--bd-fs-sm);
  color: var(--bd-text-primary);
}
.bd-filter-count {
  font-size: var(--bd-fs-xs);
  color: var(--bd-text-muted);
  background: rgba(255,255,255,0.06);
  padding: 1px 6px;
  border-radius: var(--bd-radius-pill);
}
```

---

## 7. Animation Layer

Activar con `.bd-animated` en el contenedor padre (o en cada tarjeta individualmente).

### 7a. Staggered reveal (entrada de lista)

Las tarjetas aparecen con fade + slide-up escalonado al cargar la página.

```css
@keyframes bd-fade-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Activar en el wrapper de la lista */
.bd-animated .bd-card {
  animation: bd-fade-up var(--bd-duration-slow) var(--bd-ease-enter) both;
}

/* Escalonado: cada hijo tarda un poco más */
.bd-animated .bd-card:nth-child(1) { animation-delay: 0ms; }
.bd-animated .bd-card:nth-child(2) { animation-delay: 80ms; }
.bd-animated .bd-card:nth-child(3) { animation-delay: 160ms; }
.bd-animated .bd-card:nth-child(4) { animation-delay: 240ms; }
.bd-animated .bd-card:nth-child(5) { animation-delay: 320ms; }
/* Para N items dinámico usar JS (ver 7d) */
```

### 7b. Skeleton loader

Mientras los datos cargan, mostrar placeholders animados.

```html
<article class="bd-card bd-card--skeleton" aria-hidden="true">
  <div class="bd-card__thumb bd-skeleton"></div>
  <div class="bd-card__body" style="gap:12px">
    <div class="bd-skeleton" style="height:22px; width:60%"></div>
    <div class="bd-skeleton" style="height:14px; width:40%"></div>
    <div class="bd-skeleton" style="height:14px; width:80%"></div>
    <div class="bd-skeleton" style="height:14px; width:50%"></div>
    <div class="bd-skeleton" style="height:36px; width:140px; margin-top:auto"></div>
  </div>
</article>
```

```css
@keyframes bd-shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
}

.bd-skeleton {
  border-radius: var(--bd-radius-md);
  background: linear-gradient(
    90deg,
    var(--bd-bg-skeleton) 25%,
    rgba(255,255,255,0.06) 50%,
    var(--bd-bg-skeleton) 75%
  );
  background-size: 600px 100%;
  animation: bd-shimmer 1.4s infinite linear;
}
```

### 7c. Micro-interacciones adicionales

```css
/* Pulse en el score al hover de la tarjeta */
.bd-card:hover .bd-score__value {
  animation: bd-pulse 0.4s var(--bd-ease-spring) both;
}
@keyframes bd-pulse {
  0%   { transform: scale(1);    }
  50%  { transform: scale(1.12); }
  100% { transform: scale(1);    }
}

/* Shake en CTA al intentar reservar sin fechas seleccionadas */
.bd-cta--shake {
  animation: bd-shake 0.4s var(--bd-ease-out) both;
}
@keyframes bd-shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}

/* Fade in de chips al hover de la tarjeta */
.bd-card .bd-chip {
  opacity: 0.7;
  transition: opacity var(--bd-duration-fast) var(--bd-ease-out);
}
.bd-card:hover .bd-chip {
  opacity: 1;
}

/* Badge de deal con efecto glow sutil */
.bd-badge--deal {
  box-shadow: 0 0 0 0 rgba(39,174,96,0);
  transition: box-shadow var(--bd-duration-base) var(--bd-ease-out);
}
.bd-card:hover .bd-badge--deal {
  box-shadow: 0 0 12px 2px rgba(39,174,96,0.35);
}
```

### 7d. Staggered dinámico con JS

```js
// Aplicar delay automático a N tarjetas generadas dinámicamente
document.querySelectorAll('.bd-card').forEach((card, i) => {
  card.style.animationDelay = `${i * 80}ms`;
});
```

---

## 8. Layout completo: sidebar + listing

```html
<div class="bd-layout">
  <aside class="bd-sidebar"><!-- filtros --></aside>
  <main class="bd-listing" aria-live="polite"><!-- cards --></main>
</div>
```

```css
.bd-layout {
  display: flex;
  gap: var(--bd-space-xl);
  align-items: flex-start;
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--bd-space-xl) var(--bd-space-lg);
}

@media (max-width: 900px) {
  .bd-layout { flex-direction: column; }
  .bd-sidebar { width: 100%; }
}
```

---

## 9. Guía de personalización

| Variable a cambiar          | Efecto                                           |
|-----------------------------|--------------------------------------------------|
| `--bd-bg-page`              | Tono base del fondo de página                    |
| `--bd-bg-card`              | Profundidad visual de las tarjetas               |
| `--bd-blue-cta`             | Color del botón primario / brand color           |
| `--bd-img-w`                | Ancho del thumbnail (compactar o expandir)       |
| `--bd-duration-base`        | Velocidad global de todas las animaciones        |
| `--bd-ease-spring`          | Tipo de curva del efecto spring del CTA          |
| `--bd-radius-card`          | Curvatura de bordes de tarjeta                   |
| `--bd-shadow-card-hover`    | Intensidad del hover lift                        |

Para **light mode**: reemplazar los valores de superficie (`--bd-bg-*`) por tonos
claros y los textos por oscuros. Las animaciones y demás tokens funcionan igual.

---

## 10. Accesibilidad

- Cada `<article class="bd-card">` lleva `aria-label` con el nombre del item.
- Las estrellas usan `role="img"` y `aria-label="N estrellas"`.
- El precio marcado como original usa `<del>` semántico en producción.
- Preferir `prefers-reduced-motion`: envolver animaciones en:

```css
@media (prefers-reduced-motion: no-preference) {
  .bd-animated .bd-card { animation: bd-fade-up ... ; }
  /* ... resto de las keyframe animations ... */
}
```

- El skeleton tiene `aria-hidden="true"` para que los lectores de pantalla
  no lo anuncien.