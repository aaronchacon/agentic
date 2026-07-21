import type { Localized } from '../i18n/i18n';
import type { Feature } from '../model/feature.model';

const EN = {
  hero: {
    eyebrow: 'Angular 21 · signals · AG-UI compatible',
    title:
      'Agent UI your <span class="grad">compliance team</span> can sign off on',
    lead: 'Streaming chat, visible tool-calling, execution plans, human-in-the-loop approvals and AI provenance — production-grade Angular components for teams building AI into regulated products.',
    getStarted: 'Get started →',
    viewOnGitHub: 'View on GitHub',
  },
  features: [
    {
      title: 'Human-in-the-loop, built in',
      body: 'Approval gates for actions that need a person: approve, edit or reject — with full state tracking, not a bolted-on confirm().',
    },
    {
      title: 'Provenance by default',
      body: 'Users always see what the AI wrote, suggested or summarized — one consistent visual language across chat, summaries and form fields.',
    },
    {
      title: 'Agentic, not just chat',
      body: "Tool-calling cards and execution-trace plans make the agent's work visible, step by step — not a black box.",
    },
    {
      title: 'Streaming, done right',
      body: 'Smooth markdown reveal with syntax-highlighted code, a collapsible reasoning trace and a live cursor.',
    },
    {
      title: 'Themeable by tokens',
      body: '3-layer design tokens (primitive → semantic → component), dark and light. Swap presets or restyle without forking CSS.',
    },
    {
      title: 'Accessible & headless',
      body: 'AA contrast, keyboard-first, dark mode. Bring your own transport via the AG-UI-compatible contract.',
    },
  ] satisfies Feature[],
  regulated: {
    eyebrow: 'Built for regulated products',
    title: 'When "the AI did it" isn\'t an acceptable answer',
    lead: 'In fintech, KYC, legal and health, AI features carry three extra expectations: a human can intervene, AI content is distinguishable from human content, and decisions are traceable. Most agent UI kits treat these as edge cases. agentic treats them as the core.',
    items: [
      '<strong>KYC &amp; onboarding</strong> — approval gates and provenance on every extracted field.',
      '<strong>Fintech dashboards</strong> — visible agent actions and execution traces, step by step.',
      '<strong>Legal &amp; health workflows</strong> — human-in-the-loop before anything is committed.',
    ],
    note: "agentic gives you the UI building blocks — compliance itself is your product's job.",
  },
  footer: {
    builtBy: 'Built by',
    license: 'MIT licensed',
    source: 'Source on GitHub',
  },
};

export const HOME_I18N: Localized<typeof EN> = {
  en: EN,
  es: {
    hero: {
      eyebrow: 'Angular 21 · signals · compatible con AG-UI',
      title:
        'UI de agentes que tu <span class="grad">equipo de compliance</span> puede aprobar',
      lead: 'Chat en streaming, tool-calling visible, planes de ejecución, aprobaciones human-in-the-loop y procedencia de IA — componentes Angular de calidad de producción para equipos que integran IA en productos regulados.',
      getStarted: 'Empieza ahora →',
      viewOnGitHub: 'Ver en GitHub',
    },
    features: [
      {
        title: 'Human-in-the-loop, de serie',
        body: 'Puertas de aprobación para las acciones que necesitan a una persona: aprueba, edita o rechaza — con seguimiento completo del estado, no un confirm() pegado encima.',
      },
      {
        title: 'Procedencia por defecto',
        body: 'Los usuarios siempre ven qué escribió, sugirió o resumió la IA — un lenguaje visual consistente en chat, resúmenes y campos de formulario.',
      },
      {
        title: 'Agéntico, no solo chat',
        body: 'Las tarjetas de tool-calling y los planes con traza de ejecución hacen visible el trabajo del agente, paso a paso — no una caja negra.',
      },
      {
        title: 'Streaming, bien hecho',
        body: 'Revelado suave de markdown con código resaltado, traza de razonamiento plegable y cursor en vivo.',
      },
      {
        title: 'Tematizable con tokens',
        body: 'Design tokens de 3 capas (primitivo → semántico → componente), en modo oscuro y claro. Cambia de preset o restiliza sin forkear el CSS.',
      },
      {
        title: 'Accesible y headless',
        body: 'Contraste AA, teclado primero, modo oscuro. Trae tu propio transport con el contrato compatible con AG-UI.',
      },
    ],
    regulated: {
      eyebrow: 'Pensado para productos regulados',
      title: 'Cuando "lo hizo la IA" no es una respuesta aceptable',
      lead: 'En fintech, KYC, legal y salud, las funciones de IA cargan con tres expectativas extra: una persona puede intervenir, el contenido de la IA se distingue del humano y las decisiones son trazables. La mayoría de los kits de UI de agentes las tratan como casos límite. agentic las trata como el núcleo.',
      items: [
        '<strong>KYC y onboarding</strong> — puertas de aprobación y procedencia en cada campo extraído.',
        '<strong>Dashboards fintech</strong> — acciones del agente visibles y trazas de ejecución, paso a paso.',
        '<strong>Flujos legales y de salud</strong> — human-in-the-loop antes de confirmar nada.',
      ],
      note: 'agentic te da los bloques de UI — el compliance en sí es responsabilidad de tu producto.',
    },
    footer: {
      builtBy: 'Hecho por',
      license: 'licencia MIT',
      source: 'Código en GitHub',
    },
  },
};
