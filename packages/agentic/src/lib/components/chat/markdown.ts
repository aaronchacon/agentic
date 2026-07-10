import hljs from 'highlight.js/lib/common';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

marked.use(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
);
marked.setOptions({ gfm: true, breaks: true });

/**
 * Render a markdown string to HTML with syntax-highlighted code (highlight.js).
 * The result is bound via Angular's `[innerHTML]`, which sanitizes it (only the
 * highlight `<span class>`s and standard tags survive). Malformed partial
 * markdown mid-stream falls back to escaped text.
 */
export function renderMarkdown(source: string): string {
  if (!source) return '';
  try {
    return marked.parse(source, { async: false }) as string;
  } catch {
    return escapeHtml(source);
  }
}

/**
 * Turn an arbitrary tool/approval `detail` into markdown: strings verbatim,
 * objects as a fenced JSON block. Safe against circular structures.
 */
export function toDetailMarkdown(detail: unknown): string {
  if (detail === null || detail === undefined || detail === '') return '';
  if (typeof detail === 'string') return detail;
  try {
    return '```json\n' + JSON.stringify(detail, null, 2) + '\n```';
  } catch {
    return String(detail);
  }
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );
}
