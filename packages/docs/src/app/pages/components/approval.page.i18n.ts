import type { Localized } from '../../i18n/i18n';

const EN = {
  eyebrow: 'Components',
  title: 'Approval',
  lead: 'A human-in-the-loop gate: the agent pauses and asks a person to approve, edit or reject an action before proceeding — non-negotiable in regulated flows. Resolves to an approved or rejected state.',
  gateTitle: 'Gate',
  gateIntro:
    'Click Approve or Reject to resolve — the card records the decision.',
  apiTitle: 'API',
  eventsHeader: 'Event',
  props: {
    action: 'The action being gated, shown to the reviewer.',
    title: 'Card heading.',
    detail: 'Optional payload rendered as a JSON block.',
    editable: 'Show an Edit action alongside Approve / Reject.',
    state: 'Current decision (two-way, [(state)]).',
  },
  events: {
    approve: 'Emitted when the reviewer approves.',
    reject: 'Emitted when the reviewer rejects.',
    edit: 'Emitted when the Edit action is pressed (if editable).',
  },
};

export const APPROVAL_I18N: Localized<typeof EN> = {
  en: EN,
  es: {
    eyebrow: 'Componentes',
    title: 'Approval',
    lead: 'Una puerta human-in-the-loop: el agente se pausa y pide a una persona aprobar, editar o rechazar una acción antes de continuar — innegociable en flujos regulados. Se resuelve en un estado aprobado o rechazado.',
    gateTitle: 'Puerta de aprobación',
    gateIntro:
      'Haz clic en Aprobar o Rechazar para resolver — la tarjeta registra la decisión.',
    apiTitle: 'API',
    eventsHeader: 'Evento',
    props: {
      action:
        'La acción bajo la puerta de aprobación, que se muestra al revisor.',
      title: 'Encabezado de la tarjeta.',
      detail: 'Payload opcional que se renderiza como un bloque JSON.',
      editable: 'Muestra una acción Editar junto a Aprobar / Rechazar.',
      state: 'Decisión actual (bidireccional, [(state)]).',
    },
    events: {
      approve: 'Se emite cuando el revisor aprueba.',
      reject: 'Se emite cuando el revisor rechaza.',
      edit: 'Se emite cuando se pulsa la acción Editar (si es editable).',
    },
  },
};
