# nexo-web

Panel de administración para inmobiliarias: gestión de contratos, inquilinos y el estado de mora.
Angular 22, standalone, Signals — sin NgRx ni Angular Material, con un sistema de componentes
propio ("Cristal", vidrio líquido y tonos fríos, inspirado en la línea de diseño más reciente de
iOS/visionOS). El diseño completo está en
[`SAD_Nexo_Gestion_Arrendamientos.md`](../SAD_Nexo_Gestion_Arrendamientos.md).

## Desarrollo local

Necesita `nexo-api` corriendo en `http://localhost:8080` (ver su propio README) con CORS
habilitado para `http://localhost:4200`, que es el default.

```bash
npm install
ng serve
```

Abrir `http://localhost:4200`.

## Tests y build

```bash
ng test
ng build
```

## Sistema de diseño

La ruta raíz (`/`) sirve de vitrina viva de los componentes compartidos
(`shared/components`) mientras se construyen las pantallas reales — botones, campos de texto y
select con el mismo lenguaje visual, tokens en `src/styles/_tokens.scss` (paleta, tipografía,
espaciado, radios, sombras, easing) y soporte de modo oscuro automático vía
`prefers-color-scheme`.

El efecto de vidrio (`src/styles/_glass.scss`) usa `backdrop-filter: blur() saturate()` sobre
fondos semitransparentes, con un fondo de página en degradados (`--mesh-bg`) para que haya algo
con textura y color detrás de los paneles — sin eso, el blur no tiene nada interesante que
difuminar y el efecto se pierde. `<input>` y `<select>` son elementos reemplazados y no pintan
`::before`, así que usan `glass.glass-base` (blur + borde, sin el highlight superior); `.card` y
los botones sí soportan contenido generado y usan `glass.glass-surface` con el brillo superior.

## Variables de entorno

La URL de la API se resuelve en tiempo de build, no en tiempo de ejecución — es una SPA estática
sin backend propio. En desarrollo usa `src/environments/environment.ts`
(`http://localhost:8080`); en el build de Docker, el `Dockerfile` reemplaza el placeholder de
`src/environments/environment.prod.ts` con el build arg `API_BASE_URL`.
