import type { Localized } from '../../i18n/i18n';

const EN = {
  eyebrow: 'Components',
  title: 'Tool Call',
  lead: 'An in-conversation card that visualizes a tool invocation — running (spinner + optional steps), success (green, with the result) or error (with the detail). The result renders as a syntax-highlighted JSON block.',
  statesTitle: 'States',
  apiTitle: 'API',
  props: {
    toolCall: 'The call to render: { id, name, status, detail? }.',
    steps: 'Sub-steps shown while running and on expand.',
  },
};

export const TOOL_CALL_I18N: Localized<typeof EN> = {
  en: EN,
  es: {
    eyebrow: 'Componentes',
    title: 'Tool Call',
    lead: 'Una tarjeta dentro de la conversación que visualiza una invocación de tool — en ejecución (spinner + pasos opcionales), éxito (verde, con el resultado) o error (con el detalle). El resultado se renderiza como un bloque JSON con resaltado de sintaxis.',
    statesTitle: 'Estados',
    apiTitle: 'API',
    props: {
      toolCall: 'La llamada a renderizar: { id, name, status, detail? }.',
      steps: 'Sub-pasos que se muestran durante la ejecución y al expandir.',
    },
  },
};
