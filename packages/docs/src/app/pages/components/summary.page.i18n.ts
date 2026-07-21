import type { Localized } from '../../i18n/i18n';

const EN = {
  eyebrow: 'Components',
  title: 'Summary',
  lead: 'A card for AI-generated summaries — clearly marked as AI content, with regenerate + copy actions and a skeleton while loading. Content renders as markdown and can stream in.',
  loadedTitle: 'Loaded',
  loadingTitle: 'Loading',
  apiTitle: 'API',
  eventHeader: 'Event',
  props: {
    title: 'Summary heading.',
    content: 'Markdown content of the summary.',
    loading: 'Shows a skeleton placeholder while true.',
    streaming: 'Reveal the content progressively.',
    streamSpeed: "'instant' | 'slow' | 'smooth' | 'fast', or words/second.",
  },
  events: {
    regenerate: 'Emitted when the regenerate button is pressed.',
  },
};

export const SUMMARY_I18N: Localized<typeof EN> = {
  en: EN,
  es: {
    eyebrow: 'Componentes',
    title: 'Summary',
    lead: 'Una tarjeta para resúmenes generados por IA — claramente marcada como contenido de IA, con acciones de regenerar + copiar y un skeleton durante la carga. El contenido se renderiza como markdown y puede llegar en streaming.',
    loadedTitle: 'Cargado',
    loadingTitle: 'Cargando',
    apiTitle: 'API',
    eventHeader: 'Evento',
    props: {
      title: 'Encabezado del resumen.',
      content: 'Contenido markdown del resumen.',
      loading: 'Muestra un placeholder de skeleton mientras es true.',
      streaming: 'Revela el contenido progresivamente.',
      streamSpeed:
        "'instant' | 'slow' | 'smooth' | 'fast', o palabras por segundo.",
    },
    events: {
      regenerate: 'Se emite al pulsar el botón de regenerar.',
    },
  },
};
