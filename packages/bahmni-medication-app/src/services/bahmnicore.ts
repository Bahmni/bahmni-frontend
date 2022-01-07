import {DrugOrderConfig} from '../types'
import {REST_ENDPOINTS} from '../utils/constants'
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
    REST_ENDPOINTS.DRUG_ORDER_CONFIG,
  )
  return responseBody(response)
}
