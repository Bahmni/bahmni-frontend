/**
 * This is the entrypoint file of the application. It communicates the
 * important features of this microfrontend to the app shell. It
 * connects the app shell to the React application(s) that make up this
 * microfrontend.
 */

import {getAsyncLifecycle} from '@openmrs/esm-framework'

/**
 * This tells the app shell how to obtain translation files: that they
 * are JSON files in the directory `../translations` (which you should
 * see in the directory structure).
 */
const importTranslation = require.context(
  '../translations',
  false,
  /.json$/,
  'lazy',
)

/**
 * This tells the app shell what versions of what OpenMRS backend modules
 * are expected. Warnings will appear if suitable modules are not
 * installed. The keys are the part of the module name after
 * `openmrs-module-`; e.g., `openmrs-module-fhir2` becomes `fhir2`.
 */
const backendDependencies = {
  fhir2: '^1.2.0',
  'webservices.rest': '^2.2.0',
}

function setupOpenMRS() {
  const moduleName = '@bahmni/lab-lite-app'

  const options = {
    featureName: 'lab-lite',
    moduleName,
  }

  return {
    pages: [
      {
        load: getAsyncLifecycle(() => import('./lab-lite'), options),
        route: 'labLite',
      },
    ],
  }
}

export {backendDependencies, importTranslation, setupOpenMRS}
