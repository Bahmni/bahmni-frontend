import {render, waitFor, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {when} from 'jest-when'
import React from 'react'
import {search} from './services/drugs'
import MedicationApp from './index'
import {
  mockDrugsApiResponse,
  mockMedicationConfigRespone,
  mockNonCodedDrugConfigResponse,
} from './utils/tests-utils/mockApiContract'
import {axe} from 'jest-axe'
import {fetchMedicationConfig} from './services/config'
import MockAdapter from 'axios-mock-adapter/types'
import {initMockApi} from './utils/tests-utils/baseApiSetup'

jest.mock('./services/drugs', () => ({
  __esModule: true,
  search: jest.fn(),
}))

let adapter: MockAdapter, waitForApiCalls: Function, apiParams: Function

Element.prototype.scrollIntoView = jest.fn()

test('should pass hygene accessibility tests', async () => {
  const {container} = render(<MedicationApp />)
  expect(await axe(container)).toHaveNoViolations()
})

describe('Medication tab - Drugs search', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should show matching drugs when user enters valid input in search bar', async () => {
    when(search)
      .calledWith('Par')
      .mockResolvedValue(mockDrugsApiResponse.validResponse)
    render(<MedicationApp />)

    await searchDrug('Par')

    expect(screen.getByText(/paracetomal 1/i)).toBeInTheDocument()
    expect(screen.getByText(/paracetomal 2/i)).toBeInTheDocument()
  })

  it('should not show any results when user input have no matching drugs', async () => {
    when(search)
      .calledWith('bogus')
      .mockResolvedValue(mockDrugsApiResponse.emptyResponse)
    render(<MedicationApp />)

    await searchDrug('bogus')

    expect(screen.queryByTestId(/drugDataId/i)).toBeNull()
  })

  it('should require user to enter minimum 2 character for searching drugs', async () => {
    when(search)
      .calledWith('Pa')
      .mockResolvedValue(mockDrugsApiResponse.validResponse)
    render(<MedicationApp />)
    const searchBox = screen.getByRole('searchbox', {name: /searchdrugs/i})

    userEvent.type(searchBox, 'P')
    await waitFor(() => expect(search).not.toBeCalled())
    expect(screen.queryByTestId(/drugDataId/i)).toBeNull()

    userEvent.type(searchBox, 'a')
    await waitFor(() => expect(search).toBeCalledTimes(1))
    expect(screen.getByText(/paracetomal 1/i)).toBeInTheDocument()
    expect(screen.getByText(/paracetomal 2/i)).toBeInTheDocument()
  })

  it('should show prescription widget', () => {
    render(<MedicationApp />)

    expect(screen.getByTitle('prescriptionWidget')).toBeInTheDocument()
  })
})

describe('Medication tab - Add Prescription Dialog', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    when(search)
      .calledWith('Par')
      .mockResolvedValue(mockDrugsApiResponse.validResponse)
  })
  it('should show prescription dialog when user clicks a drug', async () => {
    render(<MedicationApp />)
    await searchDrug('Par')

    expect(screen.queryByTitle('prescriptionDialog')).toBeNull()

    const drugOption = screen.getByText(/paracetomal 1/i)
    userEvent.click(drugOption)

    await waitFor(() =>
      expect(screen.getByTitle('prescriptionDialog')).toBeInTheDocument(),
    )
  })

  //FIXME: this test would change after implmenting Add Prescription button
  it('should hide prescription dialog when user clicks cancel', async () => {
    render(<MedicationApp />)
    await searchDrug('Par')

    userEvent.click(screen.getByText(/paracetomal 1/i))

    await waitFor(() =>
      expect(screen.getByTitle('prescriptionDialog')).toBeInTheDocument(),
    )
    const cancelButton = screen.getByText(/cancel/i)
    userEvent.click(cancelButton)

    expect(screen.queryByTitle('prescriptionDialog')).not.toBeInTheDocument()
  })

  //FIXME Done is currently placeholder and would be implemented in future stories
  it('WIP: should add prescription when user click Done', async () => {
    render(<MedicationApp />)
    await searchDrug('Par')

    userEvent.click(screen.getByText(/paracetomal 1/i))

    await waitFor(() =>
      expect(screen.getByTitle('prescriptionDialog')).toBeInTheDocument(),
    )
    const doneButton = screen.getByText(/done/i)
    userEvent.click(doneButton)

    expect(screen.queryByTitle('prescriptionDialog')).not.toBeInTheDocument()
  })
})

describe('Medication Tab - Prescribe non coded drugs', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  beforeEach(() => {
    when(search)
      .calledWith('Paz')
      .mockResolvedValue(mockDrugsApiResponse.emptyResponse),
      sessionStorage.clear()
    ;({adapter, waitForApiCalls, apiParams} = initMockApi())
  })

  it('should display suggestion with user input when there is no matching drugs', async () => {
    adapter
      .onGet('/bahmni_config/openmrs/apps/clinical/medication.json')
      .reply(200, mockMedicationConfigRespone)
    render(<MedicationApp />)
    await searchDrug('Paz')
    await waitForFetchMedicationConfig()

    expect(screen.getByText('"Paz"')).toBeInTheDocument()
    expect(screen.getByTestId('nonCodedDrug')).not.toBeNull()
  })

  describe('Medication configured to accept non coded drugs', () => {
    it('should show prescription dialog when user clicks a non coded drug ', async () => {
      adapter
        .onGet('/bahmni_config/openmrs/apps/clinical/medication.json')
        .reply(200, mockMedicationConfigRespone)
      render(<MedicationApp />)
      await searchDrug('Paz')
      await waitForFetchMedicationConfig()

      userEvent.click(screen.getByTestId('nonCodedDrug'))
      await waitFor(() =>
        expect(screen.getByTitle('prescriptionDialog')).toBeInTheDocument(),
      )
    })
  })

  describe('Medication configured to not accept non coded drugs', () => {
    it('should show prescription dialog when user clicks a non coded drug ', async () => {
      adapter
        .onGet('/bahmni_config/openmrs/apps/clinical/medication.json')
        .reply(200, mockNonCodedDrugConfigResponse)
      render(<MedicationApp />)
      await searchDrug('Paz')
      await waitForFetchMedicationConfig()

      userEvent.click(screen.getByTestId('nonCodedDrug'))

      expect(
        screen.getByText(
          'This drug is not available in the system. Please select from the list of drugs available in the system',
        ),
      ).toBeInTheDocument()

      expect(screen.queryByTitle('prescriptionDialog')).toBeNull()
    })
  })
})

async function searchDrug(durgName: string) {
  const searchBox = screen.getByRole('searchbox', {name: /searchdrugs/i})
  userEvent.type(searchBox, durgName)
  await waitFor(() => expect(search).toBeCalledTimes(durgName.length - 1))
}

async function waitForFetchMedicationConfig() {
  await waitForApiCalls({
    apiURL: '/bahmni_config/openmrs/apps/clinical/medication.json',
    times: 1,
  })
}
