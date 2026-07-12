/** A single link in the docs sidebar navigation. */
export interface NavItem {
  label: string;
  path: string;
}

/** A titled group of nav links (e.g. "Getting started", "Components"). */
export interface NavSection {
  title: string;
  items: NavItem[];
}
