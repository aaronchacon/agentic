import type { Localized } from '../../i18n/i18n';

const EN = {
  eyebrow: 'Components',
  title: 'Plan',
  lead: "The agent's plan / execution-trace as a vertical timeline of steps — pending, active, done or error — with a progress summary in the header. Collapsible.",
  timelineTitle: 'Timeline',
  apiTitle: 'API',
  props: {
    steps: 'Ordered steps: { id, label, status }.',
    title: 'Header title.',
  },
};

export const PLAN_I18N: Localized<typeof EN> = {
  en: EN,
  es: {
    eyebrow: 'Componentes',
    title: 'Plan',
    lead: 'El plan / traza de ejecución del agente como una línea de tiempo vertical de pasos — pendiente, activo, hecho o error — con un resumen de progreso en el encabezado. Plegable.',
    timelineTitle: 'Línea de tiempo',
    apiTitle: 'API',
    props: {
      steps: 'Pasos ordenados: { id, label, status }.',
      title: 'Título del encabezado.',
    },
  },
};
