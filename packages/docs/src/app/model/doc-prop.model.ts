/** A single row in a component's API reference table. */
export interface DocProp {
  /** Property / input / event name, e.g. `store` or `regenerate`. */
  name: string;
  /** TypeScript type, rendered monospace. */
  type: string;
  /** Default value. Omit for required inputs (set `required`) or events. */
  default?: string;
  /** Marks a required input — renders a "required" badge in the Default column. */
  required?: boolean;
  /** One-line description. */
  description: string;
}
