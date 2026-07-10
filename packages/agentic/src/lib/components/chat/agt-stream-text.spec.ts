import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AgtStreamText } from './agt-stream-text';

describe('AgtStreamText', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  function render(text: string, streaming = false, speed = 'smooth') {
    const fixture = TestBed.createComponent(AgtStreamText);
    fixture.componentRef.setInput('text', text);
    fixture.componentRef.setInput('streaming', streaming);
    fixture.componentRef.setInput('speed', speed);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders markdown (bold) fully when not streaming', () => {
    const el = render('**Hello** brave new world', false);
    expect(el.innerHTML).toContain('<strong>Hello</strong>');
    expect(el.textContent).toContain('Hello brave new world');
  });

  it('renders fenced code as a <pre><code> block', () => {
    const el = render('```ts\nconst x = 1;\n```', false);
    expect(el.querySelector('pre code')).toBeTruthy();
    expect(el.textContent).toContain('const x = 1;');
  });

  it('reveals the full text immediately for instant speed', () => {
    const el = render('Instant reveal', true, 'instant');
    expect(el.textContent).toContain('Instant reveal');
  });
});
