import { TestBed } from '@angular/core/testing';
import { Aurora } from '@ng-agentic/themes';
import { AgenticThemeService } from './agentic-theme.service';

describe('AgenticThemeService', () => {
  let service: AgenticThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgenticThemeService);
    document.getElementById('agt-theme')?.remove();
    document.documentElement.classList.remove('agt-dark', 'app-dark');
  });

  it('injects a <style id="agt-theme"> with compiled CSS vars on configure()', () => {
    service.configure();
    const style = document.getElementById('agt-theme');
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain('--agt-primary-color');
    expect(style?.textContent).toContain('.agt-dark {');
  });

  it('toggles class-based dark mode on <html>', () => {
    service.configure();
    service.toggleDarkMode(true);
    expect(document.documentElement.classList.contains('agt-dark')).toBe(true);
    expect(service.isDark()).toBe(true);
    service.toggleDarkMode(false);
    expect(document.documentElement.classList.contains('agt-dark')).toBe(false);
  });

  it('honours a custom dark selector', () => {
    service.configure(undefined, { darkSelector: '.app-dark' });
    service.toggleDarkMode(true);
    expect(document.documentElement.classList.contains('app-dark')).toBe(true);
  });

  it('swaps the preset at runtime', () => {
    service.setPreset(Aurora);
    expect(service.preset()).toBe(Aurora);
    expect(document.getElementById('agt-theme')?.textContent).toContain(
      '--agt-primary-color',
    );
  });

  it('merges token overrides via updatePreset()', () => {
    service.configure();
    service.updatePreset({
      semantic: {
        colorScheme: { light: { primary: { color: '#ff0000' } }, dark: {} },
      },
    });
    const light = service.preset().semantic?.colorScheme?.light as Record<
      string,
      Record<string, string>
    >;
    expect(light['primary']['color']).toBe('#ff0000');
  });
});
