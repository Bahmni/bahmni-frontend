import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter/types'
import MedicationApp from '..'
import {StoppedPrescriptionsProvider} from '../context/StoppedPrescriptionContext'
import {CONFIG_URLS, REST_ENDPOINTS} from '../utils/constants'
import {initMockApi} from '../utils/tests-utils/baseApiSetup'
import {
  mockActivePrescriptionResponse,
  mockDrugOrderConfigApiResponse,
  mockMedicationConfigResponse,
} from '../utils/tests-utils/mockApiContract'
import {when} from 'jest-when'
import {useProviderName, useUserLocationUuid} from '../utils/cookie'
import {getPatientUuid} from '../utils/helper'

let adapter: MockAdapter,
  waitForApiCalls: Function,
  waitForPostCalls: Function,
  apiBody: Function
;({adapter, waitForApiCalls, waitForPostCalls, apiBody} = initMockApi())

jest.mock('../utils/cookie', () => {
  return {
    __esModule: true,
    useProviderName: jest.fn(),
    useUserLocationUuid: jest.fn(),
  }
})

jest.mock('../utils/helper', () => {
  const originalModule = jest.requireActual('../utils/helper')
  return {
    __esModule: true,
    ...originalModule,
    getPatientUuid: jest.fn(),
  }
})

describe('Medication Tab - Saving Stopped Prescriptions', () => {
  it('should save stopped prescriptions', async () => {
    when(useProviderName).mockReturnValue('superman')
    when(useUserLocationUuid).mockReturnValue('locationUuid')
    when(getPatientUuid).mockReturnValue('patientUuid')
    adapter
      .onGet(REST_ENDPOINTS.DRUG_ORDER_CONFIG)
      .reply(200, mockDrugOrderConfigApiResponse)
    adapter
      .onGet(REST_ENDPOINTS.ACTIVE_PRESCRIPTION)
      .reply(200, mockActivePrescriptionResponse)
    adapter
      .onGet(REST_ENDPOINTS.ALL_PRESCRIPTION)
      .reply(200, mockActivePrescriptionResponse)
    adapter
      .onGet(CONFIG_URLS.MEDICATION_CONFIG)
      .reply(200, mockMedicationConfigResponse.allowCodedAndNonCodedDrugs)
    adapter.onPost(REST_ENDPOINTS.SAVE_NEW_PRESCRIPTION).reply(200)

    renderWithContextProvider(<MedicationApp />)
    await waitForMedicationConfig()

    userEvent.click(screen.getAllByText(/stop/i)[0])
    userEvent.click(screen.getByRole('button', {name: /done/i}))
    await waitFor(() => {
      expect(screen.getAllByText(/undo/i).length).toBe(2)
    })
    userEvent.click(screen.getByRole('button', {name: /save/i}))
    await waitFor(() => {
      expect(screen.getByText(/save successful/i)).toBeInTheDocument()
    })
    expect(
      JSON.parse(apiBody(REST_ENDPOINTS.SAVE_NEW_PRESCRIPTION)).drugOrders[0],
    ).toMatchObject({
      action: 'DISCONTINUE',
      drug: mockActivePrescriptionResponse[1].drug,
    })
    adapter.reset()

    userEvent.click(screen.getByRole('button', {name: /save/i}))
    await waitForPostCalls({
      apiURL: REST_ENDPOINTS.SAVE_NEW_PRESCRIPTION,
      times: 0,
    })
  })
})

async function waitForMedicationConfig() {
  await waitForApiCalls({
    apiURL: CONFIG_URLS.MEDICATION_CONFIG,
    times: 1,
  })
}

function renderWithContextProvider(children) {
  return render(
    <StoppedPrescriptionsProvider>{children}</StoppedPrescriptionsProvider>,
  )
}
