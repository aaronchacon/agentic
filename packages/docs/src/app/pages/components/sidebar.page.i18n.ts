import type { Localized } from '../../i18n/i18n';

const EN = {
  eyebrow: 'Components',
  title: 'Sidebar',
  lead: 'A collapsible agent side panel that wraps its content (e.g. the chat). When closed it shows a floating action button with an optional badge; when open it slides in a docked panel with managed focus and <code>inert</code>.',
  panelTitle: 'Agent panel',
  panelIntro:
    'The launcher is fixed to the bottom-right of the page. Click it to slide in the panel — the FAB colour is themeable via <code>--agt-sidebar-fab-background</code>.',
  panelHint: 'The agent launcher is at the bottom-right of the page → open it.',
  apiTitle: 'API',
  props: {
    open: 'Whether the panel is open (two-way, [(open)]).',
    title: 'Panel header title.',
    side: 'Which edge the panel docks to.',
    badge: 'Unread badge on the launcher (count or dot).',
  },
};

export const SIDEBAR_I18N: Localized<typeof EN> = {
  en: EN,
  es: {
    eyebrow: 'Componentes',
    title: 'Sidebar',
    lead: 'Un panel lateral de agente plegable que envuelve su contenido (p. ej. el chat). Cerrado, muestra un botón de acción flotante (FAB) con un badge opcional; abierto, desliza un panel acoplado con foco gestionado e <code>inert</code>.',
    panelTitle: 'Panel de agente',
    panelIntro:
      'El lanzador está fijado a la esquina inferior derecha de la página. Haz clic en él para deslizar el panel — el color del FAB es tematizable vía <code>--agt-sidebar-fab-background</code>.',
    panelHint:
      'El lanzador del agente está en la esquina inferior derecha de la página → ábrelo.',
    apiTitle: 'API',
    props: {
      open: 'Si el panel está abierto (bidireccional, [(open)]).',
      title: 'Título del encabezado del panel.',
      side: 'A qué borde se acopla el panel.',
      badge: 'Badge de no leídos en el lanzador (contador o punto).',
    },
  },
};
