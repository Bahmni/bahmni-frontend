import { getAsyncLifecycle } from '@openmrs/esm-framework';

function setupOpenMRS() {
  const moduleName = '@bahmni/patient-visits-app';

  const options = {
    featureName: 'patient-filter',
    moduleName,
  };

  return {
    extensions: [
      {
        id: 'bahmni-patient-filter-widget',
        slot: 'homepage-widgets-slot',
        order: 0,
        load: getAsyncLifecycle(() => import('./patient-filter-widget'), options),
      },
    ],
  };
}

export { setupOpenMRS };
