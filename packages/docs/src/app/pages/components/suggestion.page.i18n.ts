import type { Localized } from '../../i18n/i18n';

const EN = {
  eyebrow: 'Components',
  title: 'Suggestion',
  lead: 'A form field with an AI suggestion shown as ghost text, with accept/reject controls and a confidence badge. Tracks provenance for compliance — <strong>suggested → accepted (AI) → edited by human</strong>.',
  provenanceTitle: 'Provenance',
  provenanceIntro:
    'Accept the suggestion (Tab), then edit the value to see it flip to "Edited by human".',
  apiTitle: 'API',
  props: {
    label: 'Field label.',
    suggestion: 'AI-suggested value, shown as ghost text.',
    confidence: 'Confidence 0–1, shown as a percentage badge.',
    placeholder: 'Input placeholder text.',
    value: 'The field value (two-way, [(value)]).',
    accepted: 'Whether the value came from the AI suggestion (two-way).',
  },
};

export const SUGGESTION_I18N: Localized<typeof EN> = {
  en: EN,
  es: {
    eyebrow: 'Componentes',
    title: 'Suggestion',
    lead: 'Un campo de formulario con una sugerencia de IA mostrada como texto fantasma, con controles de aceptar/rechazar y un badge de confianza. Registra la procedencia para cumplimiento — <strong>sugerido → aceptado (IA) → editado por humano</strong>.',
    provenanceTitle: 'Procedencia',
    provenanceIntro:
      'Acepta la sugerencia (Tab) y luego edita el valor para verlo cambiar a "Edited by human".',
    apiTitle: 'API',
    props: {
      label: 'Etiqueta del campo.',
      suggestion: 'Valor sugerido por la IA, mostrado como texto fantasma.',
      confidence: 'Confianza 0–1, mostrada como un badge de porcentaje.',
      placeholder: 'Texto placeholder del input.',
      value: 'El valor del campo (bidireccional, [(value)]).',
      accepted:
        'Si el valor proviene de la sugerencia de la IA (bidireccional).',
    },
  },
};
