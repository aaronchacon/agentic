import { chain, type Rule } from '@angular-devkit/schematics';
import {
  DependencyType,
  InstallBehavior,
  addDependency,
  addRootProvider,
} from '@schematics/angular/utility';
import type { Schema } from './schema';

/** Version range for the framework-agnostic themes peer, installed by `ng add`. */
const THEMES_VERSION = '^0.2.0';

/**
 * `ng add @ng-agentic/core`: installs `@ng-agentic/themes` and wires
 * `provideAgentic()` into the standalone application config.
 */
export default function ngAdd(options: Schema): Rule {
  return chain([
    addDependency('@ng-agentic/themes', THEMES_VERSION, {
      type: DependencyType.Default,
      install: InstallBehavior.Auto,
    }),
    addRootProvider(
      options.project,
      ({ code, external }) =>
        code`${external('provideAgentic', '@ng-agentic/core')}()`,
    ),
  ]);
}
