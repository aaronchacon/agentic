import type { Localized } from '../../i18n/i18n';

const EN = {
  eyebrow: 'Components',
  title: 'Chat',
  lead: 'A ChatGPT-style chat surface: streaming markdown with syntax-highlighted code blocks, a collapsible reasoning trace, a thinking indicator, an empty state with suggestions and an auto-growing composer.',
  basicTitle: 'Basic',
  basicIntro:
    'The component is presentational: pass a store created with <code>injectAgent</code>. Connect your own transport (SSE/WebSocket) or replay fixtures — the kit never talks to an LLM.',
  apiTitle: 'API',
  props: {
    store: 'Agent store created with injectAgent().',
    suggestions: 'Prompt chips shown in the empty state.',
    emptyTitle: 'Title shown in the empty state.',
    placeholder: 'Composer placeholder text.',
    ariaLabel: 'Accessible label for the composer.',
    streamSpeed: "'instant' | 'slow' | 'smooth' | 'fast', or words/second.",
  },
};

export const CHAT_I18N: Localized<typeof EN> = {
  en: EN,
  es: {
    eyebrow: 'Componentes',
    title: 'Chat',
    lead: 'Una superficie de chat al estilo ChatGPT: markdown en streaming con bloques de código resaltados, traza de razonamiento plegable, indicador de pensamiento, estado vacío con sugerencias y un compositor que crece automáticamente.',
    basicTitle: 'Básico',
    basicIntro:
      'El componente es presentacional: pásale un store creado con <code>injectAgent</code>. Conecta tu propio transport (SSE/WebSocket) o reproduce fixtures — el kit nunca habla con un LLM.',
    apiTitle: 'API',
    props: {
      store: 'Store del agente creado con injectAgent().',
      suggestions: 'Chips de prompts que se muestran en el estado vacío.',
      emptyTitle: 'Título que se muestra en el estado vacío.',
      placeholder: 'Placeholder del compositor.',
      ariaLabel: 'Etiqueta accesible del compositor.',
      streamSpeed:
        "'instant' | 'slow' | 'smooth' | 'fast', o palabras por segundo.",
    },
  },
};
