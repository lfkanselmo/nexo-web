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

Los tests de las pantallas mockean la API con `HttpTestingController`, no le pegan a
`nexo-api` de verdad. Un detalle si escribís un test nuevo que simula un click: `<nexo-button
(click)="...">` registra el listener en el elemento host, no en el `<button>` nativo de su
propia plantilla — `elemento.dispatchEvent(new MouseEvent('click'))` sin `{ bubbles: true }` no
lo activa. `elemento.click()` nativo sí burbujea.

## Pantallas

- `/contracts`: listado con filtro por estado, y el alta de un contrato nuevo.
- `/contracts/:id`: detalle — datos del contrato, los botones de transición de estado que
  correspondan según el estado actual (el mismo mapa que `LeaseStatus.canTransitionTo` del
  backend, para no ofrecer nunca un botón que el servidor rechazaría), la sección de mora, y
  alta/listado de pagos.
- `/properties` y `/tenants`: alta y listado, simples a propósito — son soporte para poder armar
  contratos, no el foco del producto.
- `/design-system`: la vitrina de los componentes compartidos, para seguir validando el sistema
  de diseño sin mezclarlo con una pantalla real.

Los servicios (`core/services`) hablan con la API real vía `HttpClient` —
`environment.apiBaseUrl` resuelto en build time, no en runtime.

## Sistema de diseño

Tokens en `src/styles/_tokens.scss` (paleta, tipografía, espaciado, radios, sombras, easing) y
soporte de modo oscuro automático vía `prefers-color-scheme`.

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
