import {REST_ENDPOINTS} from '../utils/constants'
import {api, responseBody} from './axios'

export const getProviderUuid = async providerName => {
  const response = await api.get(REST_ENDPOINTS.PROVIDER, {
    params: {
      q: providerName.name,
    },
  })
  return responseBody(response).results[0].uuid
}

export const getEncounterTypeUuid = async () => {
  const response = await api.get(REST_ENDPOINTS.ENCOUNTER_TYPE)
  return responseBody(response).uuid
}

export const getVisitType = async patientUuid => {
  const response = await api.get(REST_ENDPOINTS.VISIT, {
    params: {
      includeInactive: false,
      patientUuid,
      v: 'custom:(visitType)',
    },
  })
  return responseBody(response).results[0].visitType.name
}

export const getNonCodedDrugUuid = async () => {
  const response = await api.get(REST_ENDPOINTS.CONCEPT, {
    params: {
      q: 'DrugOther',
    },
  })
  return responseBody(response).results[0].uuid
}
