import {api, responseBody} from './axios'

interface ActivePrescription {
  patientUuid: String
}

export const getActivePrescription = async ({patientUuid}): Promise<any> => {
  const response = await api.get<ActivePrescription>(
    `/openmrs/ws/rest/v1/bahmnicore/drugOrders/active`,
    {
      params: {
        patientUuid,
      },
    },
  )
  return responseBody(response)
}

export const getAllPrescription = async ({patientUuid}): Promise<any> => {
  const response = await api.get<ActivePrescription>(
    `/openmrs/ws/rest/v1/bahmnicore/drugOrders`,
    {
      params: {
        patientUuid,
        includeActiveVisit: true,
      },
    },
  )
  return responseBody(response)
}
