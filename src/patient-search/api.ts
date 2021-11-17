/* eslint-disable no-console */
import { openmrsFetch, fhir } from '@openmrs/esm-framework';
export async function getPatient(query) {
  const searchResult = await openmrsFetch(`/ws/rest/v1/patient?q=${query}&limit=10`, {
    method: 'GET',
  });
  const patients = Promise.all(
    await searchResult.data.results.map(async (result) => {
      return (await fhir.read<fhir.Patient>({ type: 'Patient', patient: result.uuid })).data;
    }),
  );
  return patients;
}
