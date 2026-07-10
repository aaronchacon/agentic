# Estándar de componentes — `@aaronch/agentic`

> La norma: **cada componente debe estar completo** antes de avanzar al siguiente.
> Este documento fija el estándar validado con `agt-chat` (+ `agt-reasoning`, `agt-stream-text`)
> y que **todo componente nuevo debe replicar**. Referencia canónica: `src/lib/components/chat/`.

---

## 0. Definición de "completo" (Definition of Done)

Un componente no se da por terminado hasta que **todo** esto es verde:

- [ ] API pública: standalone, OnPush, signal `input()/output()`, exportado en `index.ts`, JSDoc.
- [ ] Presentacional: consume un `AgentStore` compartido; no posee estado global propio.
- [ ] Theming: **0 valores hardcodeados** — todo por tokens `var(--agt-*)` con fallback. Funciona en light/dark y con los presets (Base/Aurora).
- [ ] Accesibilidad: **axe 0 violaciones en light Y dark** (panel a11y de Storybook), teclado + focus visible, `prefers-reduced-motion` respetado.
- [ ] Storybook: **una story por estado** (no solo el happy path), con `argTypes`; hereda el toolbar Theme/Preset y el panel a11y.
- [ ] Tests: unitarios de lógica + render/interacción (Vitest). `nx test`, `nx build` (ng-packagr) y `nx lint` en verde.
- [ ] Motion: animación suave, controlable y reduced-motion-safe; nada gratuito.

Si algo de esto falla, el componente **no está completo**.

---

## 1. Anatomía y nombres

Cada componente vive en su carpeta con estos archivos:

```
components/<grupo>/agt-<nombre>.ts        // componente (standalone, OnPush)
                   agt-<nombre>.html       // template (o inline si es pequeño)
                   agt-<nombre>.scss       // estilos (tokens + BEM)
                   agt-<nombre>.stories.ts // stories por estado
                   agt-<nombre>.spec.ts    // tests
```

- **Selector/prefijo**: `agt-<nombre>` (p. ej. `agt-tool-call`).
- **Clases CSS**: BEM con el prefijo del bloque: `.agt-<nombre>__<elemento>` / `--<modificador>`.
- **Export**: añadir a `src/index.ts` el componente y sus tipos públicos.

## 2. API pública

- `standalone` + `ChangeDetectionStrategy.OnPush` siempre.
- Entradas con `input()` / `input.required()`; salidas con `output()`. Nada de `@Input()` decorador salvo en helpers de stories.
- **Presentacional**: el componente recibe el estado (`[store]="agent"` de `injectAgent()`), lo lee y dispara acciones; no crea el store. Así varios componentes comparten una sola fuente.
- Textos configurables por input (`placeholder`, `emptyTitle`, …). **`aria-label` como input** (un placeholder no es una etiqueta accesible).
- JSDoc en todo símbolo exportado, con un snippet de uso.
- `package.json` del paquete: dependencias runtime declaradas también en `ng-package.json` → `allowedNonPeerDependencies` (p. ej. `marked`, `highlight.js`).

## 3. Theming (obligatorio — es el diferenciador)

- **Cero colores/tamaños hardcodeados.** Cada valor visual lee un token: `var(--agt-<algo>, <fallback>)`.
- 3 capas: primitiva → semántica → **componente**. Si el componente necesita tokens propios, añadirlos a los presets (`packages/agentic-themes/src/lib/presets.ts`) en `components: { <nombre>: { … } }`.
- Debe verse bien en **light, dark y con Aurora** (probar con el toolbar del Storybook).
- Estado propio `ai`/gradiente **reservado para señalar contenido generado por IA** (regla de provenance), **no** para decorar. La identidad por defecto es neutra (estilo ChatGPT).
- Truco para estilar contenido hijo entre componentes: exponer variables CSS (p. ej. `--agt-md-color`) — las custom properties **sí atraviesan** los límites de encapsulación.

## 4. Accesibilidad (obligatorio y verificado)

- Roles semánticos: `role="log"` + `aria-live="polite"` para regiones que streamean; `role="status"` + `aria-label` para loaders; `<form>`/`<button>` reales; iconos `aria-hidden`.
- Totalmente operable por teclado; anillo `:focus-visible` desde token; orden de tabulación lógico.
- `prefers-reduced-motion: reduce` desactiva animaciones no esenciales.
- **Gate**: el addon a11y (axe) de Storybook debe dar **0 violaciones en light Y dark**. Es innegociable (clave para fintech/KYC).

## 5. Motion y streaming

- Animar solo momentos de alto impacto (entrada de mensajes, reveal de texto). Con moderación.
- **Reveal controlable**: patrón `streamSpeed` (`'instant' | 'slow' | 'smooth' | 'fast'` o nº de palabras/seg), buffered para desacoplar la visualización de la llegada de tokens (ver `agt-stream-text`).
- Todo con guard `prefers-reduced-motion` y guard de `requestAnimationFrame` (SSR/tests).

## 6. Render de contenido (markdown / código)

- Markdown vía `renderMarkdown()` (`markdown.ts`) + `[innerHTML]` (Angular sanea el HTML).
- **Gotcha de encapsulación**: los estilos scoped **no** llegan al HTML inyectado por `[innerHTML]`. Estilar ese contenido con **`:host ::ng-deep`** (scoped al host). Sin esto, el markdown sale sin estilo.
- **Gotcha del sanitizer**: Angular elimina `<button>` del `[innerHTML]`. Los controles interactivos (p. ej. botón "Copy") se **inyectan por DOM** en un `afterRenderEffect`, con `aria-label` y handler real.
- **Bloques de código estilo VS Code**: tarjeta oscura + cabecera (lenguaje a la izquierda, **botón copiar arriba a la derecha**) + resaltado con `highlight.js` (tema Dark+). La tarjeta de código es oscura siempre (como ChatGPT/Claude), independientemente del tema de la app.

## 7. Estética (el "look")

- **Referencia: ChatGPT.** Limpio, neutro, con aire. **No** Copilot: nada de gradientes chillones como identidad por defecto.
- Columna de contenido centrada, buena tipografía y espaciado.
- Inputs que **auto-crecen** (sin scrollbars inesperados).
- Evitar la "estética AI genérica" (no Inter/gradiente-morado como *identidad* fija); exponerlo por tokens para que lo decida el consumidor.

## 8. Storybook

- **Una story por estado/variante**: vacío, streaming/cargando, éxito, error, deshabilitado, tamaños… no solo el caso feliz.
- Alimentar con `createFixtureTransport(script)` (incluye pausa en `approval_request` para human-in-the-loop).
- `argTypes` con controles para cada input relevante.
- Hereda del `preview.ts` global: toolbar **Theme (Light/Dark)** + **Preset (Base/Aurora)** y panel **Accessibility** (axe).
- `nx build-storybook` verde (smoke test headless).

## 9. Tests

- Vitest (`vitest-angular` para las libs Angular). Lógica pura (stores, parsers, máquinas de estado) + render/interacción de componentes con `TestBed`.
- Cubrir **todos** los estados del componente.
- Verde de extremo a extremo: `nx test <proj>` · `nx build <proj>` · `nx lint <proj>`.

---

## 10. Checklist rápida por componente

```
[ ] agt-<nombre>.ts  (standalone, OnPush, inputs signal, JSDoc, presentacional)
[ ] tokens: 0 hardcodes · light/dark/Aurora OK · component tokens en presets si aplica
[ ] a11y: roles/aria · teclado · focus-visible · reduced-motion · axe 0 (light+dark)
[ ] motion: streamSpeed/controlable · reduced-motion-safe · rAF guard
[ ] contenido: ::ng-deep para innerHTML · controles interactivos por DOM
[ ] stories: 1 por estado · fixtures · argTypes · toolbar + a11y heredados
[ ] tests: lógica + render/interacción · todos los estados
[ ] export en index.ts · deps en ng-package.json allowedNonPeerDependencies
[ ] nx test + build + lint verdes
```

## 11. Referencia canónica

`src/lib/components/chat/`:
- `agt-chat` — superficie de chat (columna centrada, burbuja usuario derecha, asistente a todo el ancho sin avatar, composer auto-grow, autoscroll con pausa).
- `agt-stream-text` — reveal buffered de markdown + bloques de código VS Code.
- `agt-reasoning` — chain-of-thought colapsable (auto-open/close, "Thinking…", duración) — patrón inspirado en AI Elements `Reasoning`.
- `core/agent-store.ts` — `injectAgent()` + contrato `AgentEvent` compatible AG-UI.
- `core/fixture-transport.ts` — `createFixtureTransport()` para stories/tests.

## 12. Gotchas técnicos (aprendidos, no repetir el tropiezo)

- **pnpm 11 `allowBuilds`**: aprobar build scripts (`@parcel/watcher`, `esbuild`, …) en `pnpm-workspace.yaml`.
- **Nx + Angular**: el setup "TS solution" (project references) no es compatible con Angular; usar el preset Angular clásico.
- **ng-packagr**: dependencias runtime → `allowedNonPeerDependencies` en `ng-package.json`.
- **`:host ::ng-deep`** para estilar `[innerHTML]`; **inyección por DOM** para controles interactivos (el sanitizer quita `<button>`).
- **Guards** `matchMedia`/`requestAnimationFrame` para tests/SSR.

---

*Este estándar se aplica a partir de `agt-tool-call` y a todos los componentes siguientes del roadmap.*
