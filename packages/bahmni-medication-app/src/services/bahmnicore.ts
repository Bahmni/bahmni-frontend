import {DrugOrderConfig} from '../types'
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

export const fetchDrugOrderConfig = async (): Promise<DrugOrderConfig> => {
  const response = await api.get<DrugOrderConfig>(
    `/openmrs/ws/rest/v1/bahmnicore/config/drugOrders`,
  )
  return responseBody(response)
}
