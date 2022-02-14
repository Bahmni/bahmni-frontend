import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter/types'
import React from 'react'
import MedicationApp from '..'
import {CONFIG_URLS, REST_ENDPOINTS} from '../utils/constants'
import {initMockApi} from '../utils/tests-utils/baseApiSetup'
import {
  mockDrugOrderConfigApiResponse,
  mockDrugsApiResponse,
  mockMedicationConfigRespone,
} from '../utils/tests-utils/mockApiContract'

let adapter: MockAdapter, waitForApiCalls: Function

jest.mock('../utils/helper', () => {
  const originalModule = jest.requireActual('../utils/helper')
  return {
    __esModule: true,
    ...originalModule,
    getPatientUuid: jest.fn(),
  }
})

describe('Medication Tab - Editting new prescription', () => {
  beforeEach(() => {
    sessionStorage.clear()
    ;({adapter, waitForApiCalls} = initMockApi())
    adapter
      .onGet(REST_ENDPOINTS.DRUG_ORDER_CONFIG)
      .reply(200, mockDrugOrderConfigApiResponse)
    adapter
      .onGet(CONFIG_URLS.MEDICATION_CONFIG)
      .reply(200, mockMedicationConfigRespone)
    adapter
      .onGet(REST_ENDPOINTS.DRUG_SEARCH)
      .reply(200, mockDrugsApiResponse.validResponse)
  })
  it('should show updated prescription info when user completes edit new prescription', async () => {
    render(<MedicationApp />)

    await waitForMedicationConfig()
    await searchDrug('Par', 2)

    userEvent.click(screen.getByText(/paracetomal 1/i))

    await fillingDosageInstructions()

    userEvent.click(screen.getByText(/edit/i))
    userEvent.clear(screen.getByLabelText('Dosage'))
    userEvent.clear(screen.getByLabelText('Duration'))
    userEvent.type(screen.getByLabelText('Dosage'), '2')
    userEvent.type(screen.getByLabelText('Duration'), '2')
    userEvent.click(screen.getByText(/done/i))

    expect(
      screen.getByRole('cell', {name: /Paracetomal 1, Tablet, Oral/i}),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('cell', {
        name: `2 Tablet\(s\), Immediately for 2 Day\(s\) starting on ${new Date().toLocaleDateString()}`,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('cell', {name: /4 Tablet\(s\)/i}),
    ).toBeInTheDocument()
  })

  it('should not show updated prescription info when user cancel edit new prescription', async () => {
    render(<MedicationApp />)

    await waitForMedicationConfig()
    await searchDrug('Par', 2)

    userEvent.click(screen.getByText(/paracetomal 1/i))

    await fillingDosageInstructions()

    userEvent.click(screen.getByText(/edit/i))
    userEvent.clear(screen.getByLabelText('Dosage'))
    userEvent.clear(screen.getByLabelText('Duration'))
    userEvent.type(screen.getByLabelText('Dosage'), '2')
    userEvent.type(screen.getByLabelText('Duration'), '2')
    userEvent.click(screen.getByText(/cancel/i))

    expect(
      screen.getByRole('cell', {name: /Paracetomal 1, Tablet, Oral/i}),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('cell', {
        name: `1 Tablet\(s\), Immediately for 1 Day\(s\) starting on ${new Date().toLocaleDateString()}`,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('cell', {name: '1 Tablet(s)'})).toBeInTheDocument()
  })
})

async function waitForMedicationConfig() {
  await waitForApiCalls({
    apiURL: CONFIG_URLS.MEDICATION_CONFIG,
    times: 1,
  })
}

async function fillingDosageInstructions() {
  await waitForConfigurationLoad()
  await waitFor(() =>
    expect(screen.getByTitle('prescriptionDialog')).toBeInTheDocument(),
  )
  userEvent.type(screen.getByLabelText('Dosage'), '1')
  userEvent.click(screen.getByTitle('Dosage Unit'))
  userEvent.click(screen.getByText('Tablet(s)'))
  userEvent.click(screen.getByLabelText('Frequency'))
  userEvent.click(screen.getByText('Immediately'))
  userEvent.type(screen.getByLabelText('Duration'), '1')
  userEvent.click(screen.getByTitle('Duration Unit'))
  userEvent.click(screen.getByText('Day(s)'))
  userEvent.click(screen.getByTitle('Route'))
  userEvent.click(screen.getByText('Oral'))
  userEvent.click(screen.getByText(/done/i))
}

async function searchDrug(durgName: string, times: Number = 0) {
  const searchBox = screen.getByRole('searchbox', {name: /searchdrugs/i})
  userEvent.type(searchBox, durgName)
  await waitForApiCalls({
    apiURL: REST_ENDPOINTS.DRUG_SEARCH,
    times: times,
  })
}

async function waitForConfigurationLoad() {
  await waitForApiCalls({
    apiURL: REST_ENDPOINTS.DRUG_ORDER_CONFIG,
    times: 1,
  })
}
