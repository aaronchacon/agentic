import type { NavSection } from '../model/nav.model';
import type { Localized } from './i18n';

const EN = {
  header: {
    toLight: 'Switch to light mode',
    toDark: 'Switch to dark mode',
    toggleLang: 'Cambiar a español',
    toggleNav: 'Toggle navigation',
  },
  nav: [
    {
      title: 'Getting started',
      items: [
        { label: 'Introduction', path: '/' },
        { label: 'Provenance', path: '/provenance' },
        { label: 'Theming', path: '/theming' },
      ],
    },
    {
      title: 'Components',
      items: [
        { label: 'Chat', path: '/components/chat' },
        { label: 'Tool Call', path: '/components/tool-call' },
        { label: 'Suggestion', path: '/components/suggestion' },
        { label: 'Summary', path: '/components/summary' },
        { label: 'Sidebar', path: '/components/sidebar' },
        { label: 'Plan', path: '/components/plan' },
        { label: 'Approval', path: '/components/approval' },
      ],
    },
  ] satisfies NavSection[],
  demo: {
    preview: 'Preview',
    code: 'Code',
    copy: 'Copy',
    copied: 'Copied',
  },
  md: {
    copy: 'Copy as Markdown',
    copied: 'Copied',
    ariaCopy: 'Copy this page as Markdown',
    ariaCopied: 'Copied',
  },
  props: {
    type: 'Type',
    default: 'Default',
    description: 'Description',
    required: 'required',
  },
};

export const CHROME_I18N: Localized<typeof EN> = {
  en: EN,
  es: {
    header: {
      toLight: 'Cambiar a modo claro',
      toDark: 'Cambiar a modo oscuro',
      toggleLang: 'Switch to English',
      toggleNav: 'Abrir o cerrar la navegación',
    },
    nav: [
      {
        title: 'Primeros pasos',
        items: [
          { label: 'Introducción', path: '/' },
          { label: 'Procedencia', path: '/provenance' },
          { label: 'Theming', path: '/theming' },
        ],
      },
      {
        title: 'Componentes',
        items: [
          { label: 'Chat', path: '/components/chat' },
          { label: 'Tool Call', path: '/components/tool-call' },
          { label: 'Suggestion', path: '/components/suggestion' },
          { label: 'Summary', path: '/components/summary' },
          { label: 'Sidebar', path: '/components/sidebar' },
          { label: 'Plan', path: '/components/plan' },
          { label: 'Approval', path: '/components/approval' },
        ],
      },
    ],
    demo: {
      preview: 'Vista previa',
      code: 'Código',
      copy: 'Copiar',
      copied: 'Copiado',
    },
    md: {
      copy: 'Copiar como Markdown',
      copied: 'Copiado',
      ariaCopy: 'Copiar esta página como Markdown',
      ariaCopied: 'Copiado',
    },
    props: {
      type: 'Tipo',
      default: 'Por defecto',
      description: 'Descripción',
      required: 'requerido',
    },
  },
};
