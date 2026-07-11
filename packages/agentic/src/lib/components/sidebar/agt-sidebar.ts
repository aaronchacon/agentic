import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  model,
  viewChild,
} from '@angular/core';

/**
 * A collapsible agent side panel that wraps its content (e.g. `<agt-chat>`).
 * When closed it shows a floating action button (FAB) with an optional badge
 * ("has something to say"); when open it slides in a docked panel with a header
 * and the projected content. Manages focus and `inert` for accessibility.
 *
 * ```html
 * <agt-sidebar [(open)]="open" title="Agent" [badge]="unread">
 *   <agt-chat [store]="agent" />
 * </agt-sidebar>
 * ```
 */
@Component({
  selector: 'agt-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      #fab
      type="button"
      class="agt-sidebar__fab"
      [class.is-hidden]="open()"
      [attr.data-side]="side()"
      [attr.aria-label]="fabLabel()"
      [attr.aria-hidden]="open() ? 'true' : null"
      [attr.tabindex]="open() ? -1 : null"
      (click)="setOpen(true)"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z"
        />
        <path
          fill="currentColor"
          d="M12 7l.9 2.3L15 10l-2.1.7L12 13l-.9-2.3L9 10l2.1-.7z"
        />
      </svg>
      @if (hasBadge()) {
        <span class="agt-sidebar__badge">{{ badgeText() }}</span>
      }
    </button>

    <aside
      class="agt-sidebar__panel"
      [class.is-open]="open()"
      [attr.data-side]="side()"
      [attr.inert]="open() ? null : ''"
      [attr.aria-label]="title()"
    >
      <div class="agt-sidebar__header">
        <span class="agt-sidebar__title">{{ title() }}</span>
        <button
          #closeBtn
          type="button"
          class="agt-sidebar__close"
          aria-label="Close agent panel"
          (click)="setOpen(false)"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              d="M6 6l12 12M18 6 6 18"
            />
          </svg>
        </button>
      </div>
      <div class="agt-sidebar__content">
        <ng-content />
      </div>
    </aside>
  `,
  styleUrl: './agt-sidebar.scss',
})
export class AgtSidebar {
  /** Whether the panel is open (two-way). */
  readonly open = model(false);
  readonly title = input('Agent');
  readonly side = input<'right' | 'left'>('right');
  /** `true` shows a dot; a number shows a count. */
  readonly badge = input<number | boolean>(false);

  private readonly fab = viewChild<ElementRef<HTMLButtonElement>>('fab');
  private readonly closeBtn =
    viewChild<ElementRef<HTMLButtonElement>>('closeBtn');

  protected readonly hasBadge = computed(() => {
    const badge = this.badge();
    return badge === true || (typeof badge === 'number' && badge > 0);
  });

  protected readonly badgeText = computed(() => {
    const badge = this.badge();
    if (typeof badge === 'number') return badge > 9 ? '9+' : String(badge);
    return '';
  });

  protected readonly fabLabel = computed(() => {
    const badge = this.badge();
    const count = typeof badge === 'number' ? badge : 0;
    return count > 0 ? `Open agent panel, ${count} new` : 'Open agent panel';
  });

  private skipInitial = true;

  constructor() {
    // Move focus to the panel on open and back to the FAB on close (skip first run).
    effect(() => {
      const open = this.open();
      if (this.skipInitial) {
        this.skipInitial = false;
        return;
      }
      setTimeout(() => {
        (open ? this.closeBtn() : this.fab())?.nativeElement?.focus();
      });
    });
  }

  protected setOpen(open: boolean): void {
    this.open.set(open);
  }
}
