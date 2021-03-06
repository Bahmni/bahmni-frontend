import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter/types'
import {axe} from 'jest-axe'
import {when} from 'jest-when'
import React from 'react'
import {StoppedPrescriptionsProvider} from './context/StoppedPrescriptionContext'
import MedicationApp from './index'
import {PrescriptionWidget} from './PrescriptionsWidget/PrescriptionWidget'
import {CONFIG_URLS, REST_ENDPOINTS} from './utils/constants'
import {useProviderName, useUserLocationUuid} from './utils/cookie'
import {getPatientUuid} from './utils/helper'
import {initMockApi} from './utils/tests-utils/baseApiSetup'
import {
  mockDrugOrderConfigApiResponse,
  mockDrugsApiResponse,
  mockEncounterTypeResponse,
  mockMedicationConfigResponse,
  mockProviderResponse,
  mockVisitTypeResponse,
} from './utils/tests-utils/mockApiContract'

jest.mock('./PrescriptionsWidget/PrescriptionWidget')

Element.prototype.scrollIntoView = jest.fn()
let adapter: MockAdapter,
  waitForApiCalls: Function,
  waitForPostCalls: Function,
  apiBody: Function

jest.mock('./utils/cookie', () => {
  return {
    __esModule: true,
    useProviderName: jest.fn(),
    useUserLocationUuid: jest.fn(),
  }
})

jest.mock('./utils/helper', () => {
  const originalModule = jest.requireActual('./utils/helper')
  return {
    __esModule: true,
    ...originalModule,
    getPatientUuid: jest.fn(),
  }
})

test('should pass hygene accessibility tests', async () => {
  ;({adapter, waitForApiCalls} = initMockApi())
  const {container} = renderWithContextProvider(<MedicationApp />)
  adapter
    .onGet(CONFIG_URLS.MEDICATION_CONFIG)
    .reply(200, mockMedicationConfigResponse.allowCodedAndNonCodedDrugs)

  await waitForMedicationConfig()
  expect(await axe(container)).toHaveNoViolations()
})

beforeEach(() => {
  ;({adapter, waitForApiCalls, waitForPostCalls, apiBody} = initMockApi())
  sessionStorage.clear()
  adapter
    .onGet(REST_ENDPOINTS.DRUG_ORDER_CONFIG)
    .reply(200, mockDrugOrderConfigApiResponse)
  waitForSaveMedicationLoad()
  when(PrescriptionWidget).mockReturnValue(<p>Prescription Widget</p>)
})

describe('Medication Tab', () => {
  it('should show error message when fetching medication config fails', async () => {
    adapter.onGet(CONFIG_URLS.MEDICATION_CONFIG).reply(404)
    renderWithContextProvider(<MedicationApp />)

    await waitForMedicationConfig()

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('should show Loading message while fetching medication config', async () => {
    adapter.onGet(CONFIG_URLS.MEDICATION_CONFIG).timeout()
    renderWithContextProvider(<MedicationApp />)

    expect(screen.getByText(/loading data/i)).toBeInTheDocument()
    await waitForMedicationConfig()
    expect(screen.queryByText(/loading data/i)).not.toBeInTheDocument()
  })
})
describe('Medication tab - Drugs search', () => {
  beforeEach(() => {
    adapter
      .onGet(CONFIG_URLS.MEDICATION_CONFIG)
      .reply(200, mockMedicationConfigResponse.allowCodedAndNonCodedDrugs)
  })
  it('should show matching drugs when user enters valid input in search bar', async () => {
    adapter
      .onGet(REST_ENDPOINTS.DRUG_SEARCH)
      .reply(200, mockDrugsApiResponse.validResponse)

    renderWithContextProvider(<MedicationApp />)

    await waitForMedicationConfig()
    await searchDrug('Par', 2)

    expect(screen.getByText(/paracetomal 1/i)).toBeInTheDocument()
    expect(screen.getByText(/paracetomal 2/i)).toBeInTheDocument()
  })

  it('should display suggestion with user input when user input have no matching drugs', async () => {
    adapter
      .onGet(REST_ENDPOINTS.DRUG_SEARCH)
      .reply(200, mockDrugsApiResponse.emptyResponse)
    renderWithContextProvider(<MedicationApp />)
    await waitForMedicationConfig()
    await searchDrug('Paz', 2)

    expect(screen.getByText('"Paz"')).toBeInTheDocument()
    expect(screen.getByTestId('nonCodedDrug')).not.toBeNull()
  })
  it('should require user to enter minimum 2 character for searching drugs', async () => {
    adapter
      .onGet(REST_ENDPOINTS.DRUG_SEARCH)
      .reply(200, mockDrugsApiResponse.validResponse)
    renderWithContextProvider(<MedicationApp />)

    await waitForMedicationConfig()

    await searchDrug('P')
    expect(screen.queryByTestId(/drugDataId/i)).toBeNull()

    await searchDrug('a', 1)
    expect(screen.getByText(/paracetomal 1/i)).toBeInTheDocument()
    expect(screen.getByText(/paracetomal 2/i)).toBeInTheDocument()
  })

  it('should clear search bar when user clicks clear icon', async () => {
    adapter
      .onGet(REST_ENDPOINTS.DRUG_SEARCH)
      .reply(200, mockDrugsApiResponse.validResponse)
    renderWithContextProvider(<MedicationApp />)

    await waitForMedicationConfig()
    await searchDrug('Par', 2)
    expect(screen.getByText(/paracetomal 1/i)).toBeInTheDocument()
    expect(screen.getByText(/paracetomal 2/i)).toBeInTheDocument()
    expect(
      screen.queryByPlaceholderText('Search for drug to add in prescription'),
    ).toHaveValue('Par')

    const clearIcon = screen.getByRole('button', {name: 'Clear search input'})

    expect(clearIcon).toBeInTheDocument()

    userEvent.click(clearIcon)

    expect(screen.queryByText(/paracetomal 1/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/paracetomal 2/i)).not.toBeInTheDocument()
    expect(
      screen.queryByPlaceholderText('Search for drug to add in prescription'),
    ).toHaveValue('')
  })

  it('should show prescription widget', async () => {
    renderWithContextProvider(<MedicationApp />)

    await waitForMedicationConfig()

    expect(screen.getByText(/Prescription Widget/i)).toBeInTheDocument()
  })

  it('should not show new prescription table unless user adds new prescription', async () => {
    renderWithContextProvider(<MedicationApp />)

    await waitForMedicationConfig()

    expect(
      screen.queryByRole('heading', {name: /New Prescription/}),
    ).not.toBeInTheDocument()
  })
})

describe('Medication tab - Add Prescription Dialog', () => {
  beforeEach(() => {
    adapter
      .onGet(CONFIG_URLS.MEDICATION_CONFIG)
      .reply(200, mockMedicationConfigResponse.allowCodedAndNonCodedDrugs)
    adapter
      .onGet(REST_ENDPOINTS.DRUG_SEARCH)
      .reply(200, mockDrugsApiResponse.validResponse)
  })
  it('should show prescription dialog when user clicks a drug', async () => {
    renderWithContextProvider(<MedicationApp />)

    await waitForMedicationConfig()
    await searchDrug('Par', 2)

    expect(screen.queryByTitle('prescriptionDialog')).toBeNull()

    const drugOption = screen.getByText(/paracetomal 1/i)
    userEvent.click(drugOption)

    await waitForConfigurationLoad()
    await waitFor(() =>
      expect(screen.getByTitle('prescriptionDialog')).toBeInTheDocument(),
    )
  })

  it('should hide prescription dialog and new prescription table when user clicks cancel', async () => {
    renderWithContextProvider(<MedicationApp />)

    await waitForMedicationConfig()
    await searchDrug('Par', 2)

    userEvent.click(screen.getByText(/paracetomal 1/i))
    await waitForConfigurationLoad()

    await waitFor(() =>
      expect(screen.getByTitle('prescriptionDialog')).toBeInTheDocument(),
    )
    const cancelButton = screen.getByText(/cancel/i)
    userEvent.click(cancelButton)

    expect(screen.queryByTitle('prescriptionDialog')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', {name: /New Prescription/}),
    ).not.toBeInTheDocument()
  })

  it('should show new prescription table when user click Done', async () => {
    renderWithContextProvider(<MedicationApp />)

    await waitForMedicationConfig()
    await searchDrug('Par', 2)

    userEvent.click(screen.getByText(/paracetomal 1/i))

    await fillingDosageInstructions()

    expect(screen.queryByTitle('prescriptionDialog')).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', {name: /New Prescription/}),
    ).toBeInTheDocument()
  })

  it('should add new prescription to the new prescription table when user clicks done', async () => {
    renderWithContextProvider(<MedicationApp />)

    await waitForMedicationConfig()
    await searchDrug('Par', 2)

    userEvent.click(screen.getByText(/paracetomal 1/i))

    await fillingDosageInstructions()

    await waitForMedicationConfig()
    await searchDrug('Par', 4)

    userEvent.click(screen.getByText(/paracetomal 2/i))

    await fillingDosageInstructions()

    expect(screen.queryByTitle('prescriptionDialog')).not.toBeInTheDocument()
    expect(
      screen.getByRole('cell', {name: /paracetomal 1/i}),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('cell', {name: /paracetomal 2/i}),
    ).toBeInTheDocument()
  })

  it('should display new prescription in descending order', async () => {
    renderWithContextProvider(<MedicationApp />)

    await waitForMedicationConfig()
    await searchDrug('Par', 2)

    userEvent.click(screen.getByText(/paracetomal 1/i))

    await fillingDosageInstructions()

    await waitForMedicationConfig()
    await searchDrug('Par', 4)

    userEvent.click(screen.getByText(/paracetomal 2/i))

    await fillingDosageInstructions()

    expect(screen.queryByTitle('prescriptionDialog')).not.toBeInTheDocument()
    const drugs = screen.getAllByLabelText(/prescription/i)
    expect(drugs[0]).toHaveTextContent(/paracetomal 2/i)
    expect(drugs[1]).toHaveTextContent(/paracetomal 1/i)
  })

  it('should show prescription dialog when user clicks user input suggestion - Configured to accept non coded drugs ', async () => {
    adapter
      .onGet(CONFIG_URLS.MEDICATION_CONFIG)
      .reply(200, mockMedicationConfigResponse.allowCodedAndNonCodedDrugs)
    adapter
      .onGet(REST_ENDPOINTS.DRUG_SEARCH)
      .reply(200, mockDrugsApiResponse.emptyResponse)
    renderWithContextProvider(<MedicationApp />)
    await waitForMedicationConfig()
    await searchDrug('Paz', 2)

    userEvent.click(screen.getByTestId('nonCodedDrug'))
    await waitForConfigurationLoad()
    await waitFor(() =>
      expect(screen.getByTitle('prescriptionDialog')).toBeInTheDocument(),
    )
  })

  it('should show error message when user clicks user input suggestion - Configured to accept only coded drugs', async () => {
    adapter
      .onGet(CONFIG_URLS.MEDICATION_CONFIG)
      .reply(200, mockMedicationConfigResponse.allowOnlyCodedDrugs)
    adapter
      .onGet(REST_ENDPOINTS.DRUG_SEARCH)
      .reply(200, mockDrugsApiResponse.emptyResponse)
    renderWithContextProvider(<MedicationApp />)
    await waitForMedicationConfig()
    await searchDrug('Paz', 2)

    userEvent.click(screen.getByTestId('nonCodedDrug'))

    expect(
      screen.getByText(
        'This drug is not available in the system. Please select from the list of drugs available in the system',
      ),
    ).toBeInTheDocument()

    expect(screen.queryByTitle('prescriptionDialog')).toBeNull()
  })
})

describe('Medication tab - Save New Prescription', () => {
  beforeEach(() => {
    adapter
      .onGet(CONFIG_URLS.MEDICATION_CONFIG)
      .reply(200, mockMedicationConfigResponse.allowCodedAndNonCodedDrugs)
    adapter
      .onGet(REST_ENDPOINTS.DRUG_SEARCH)
      .reply(200, mockDrugsApiResponse.validResponse)
  })
  it('should render save button in medication tab', async () => {
    renderWithContextProvider(<MedicationApp />)
    await waitForMedicationConfig()

    expect(screen.getByRole('button', {name: /save/i})).toBeInTheDocument()
  })

  it('should hide new prescription table on successful save', async () => {
    renderWithContextProvider(<MedicationApp />)
    adapter.onPost(REST_ENDPOINTS.SAVE_NEW_PRESCRIPTION).reply(200)
    await saveMedication()

    await waitFor(() => {
      expect(screen.queryByTitle(/newPrescription/i)).not.toBeInTheDocument()
    })
  })

  it('should not hide new prescription table on save failure', async () => {
    renderWithContextProvider(<MedicationApp />)
    adapter.onPost(REST_ENDPOINTS.SAVE_NEW_PRESCRIPTION).reply(404)
    await saveMedication()

    await waitFor(() => {
      expect(screen.queryByTitle(/newPrescription/i)).toBeInTheDocument()
    })
  })

  it('should rerender prescription table on successful save', async () => {
    renderWithContextProvider(<MedicationApp />)
    adapter.onPost(REST_ENDPOINTS.SAVE_NEW_PRESCRIPTION).reply(200)

    await saveMedication()

    when(PrescriptionWidget).mockReturnValue(
      <p>Prescription Widget Rerendered</p>,
    )

    await waitFor(() => {
      expect(
        screen.getByText(/Prescription Widget Rerendered/i),
      ).toBeInTheDocument()
    })
    expect(screen.queryByText('Prescription Widget')).not.toBeInTheDocument()
  })

  it('should not rerender prescription table on save failure', async () => {
    renderWithContextProvider(<MedicationApp />)
    adapter.onPost(REST_ENDPOINTS.SAVE_NEW_PRESCRIPTION).reply(404)

    await saveMedication()

    when(PrescriptionWidget).mockReturnValue(
      <p>Prescription Widget Rerendered</p>,
    )

    await waitFor(() => {
      expect(
        screen.queryByText(/Prescription Widget Rerendered/i),
      ).not.toBeInTheDocument()
    })
    expect(screen.getByText(/Prescription Widget/i)).toBeInTheDocument()
  })

  it('should save non coded drug', async () => {
    adapter
      .onGet(REST_ENDPOINTS.DRUG_SEARCH)
      .reply(200, mockDrugsApiResponse.emptyResponse)
    renderWithContextProvider(<MedicationApp />)
    adapter.onPost(REST_ENDPOINTS.SAVE_NEW_PRESCRIPTION).reply(200)

    await waitForMedicationConfig()
    await searchDrug('Parz', 3)

    userEvent.click(screen.getByText(/parz/i))

    await fillingDosageInstructions()

    const drugs = screen.getAllByTitle(/newprescription/i)
    expect(drugs[0]).toHaveTextContent(/parz/i)

    userEvent.click(screen.getByRole('button', {name: /save/i}))

    await waitFor(() => {
      expect(screen.getByText(/save successful/i)).toBeInTheDocument()
    })

    expect(screen.queryByTitle(/newprescription/i)).not.toBeInTheDocument()
  })
})

describe('New Prescription table - Delete action', () => {
  beforeEach(() => {
    adapter
      .onGet(CONFIG_URLS.MEDICATION_CONFIG)
      .reply(200, mockMedicationConfigResponse.allowCodedAndNonCodedDrugs)
    adapter
      .onGet(REST_ENDPOINTS.DRUG_SEARCH)
      .reply(200, mockDrugsApiResponse.validResponse)
  })
  it('should remove drug from new prescription table on clicking ok in confirm popup ', async () => {
    window.confirm = jest.fn(() => true)

    renderWithContextProvider(<MedicationApp />)

    await waitForMedicationConfig()
    await searchDrug('Par', 2)

    userEvent.click(screen.getByText(/paracetomal 1/i))
    await fillingDosageInstructions()

    await searchDrug('Par', 4)

    userEvent.click(screen.getByText(/paracetomal 2/i))
    await fillingDosageInstructions()

    expect(
      screen.getByRole('cell', {name: /paracetomal 1/i}),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('cell', {name: /paracetomal 2/i}),
    ).toBeInTheDocument()

    userEvent.click(screen.getAllByRole('img', {name: /delete/i})[0])

    expect(
      screen.queryByRole('cell', {name: /paracetomal 2/i}),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('cell', {name: /paracetomal 1/i}),
    ).toBeInTheDocument()
  })

  it('should not remove drug from new prescription table on clicking cancel in confirm popup ', async () => {
    window.confirm = jest.fn(() => false)

    renderWithContextProvider(<MedicationApp />)

    await waitForMedicationConfig()
    await searchDrug('Par', 2)

    userEvent.click(screen.getByText(/paracetomal 1/i))
    await fillingDosageInstructions()

    userEvent.click(screen.getByRole('img', {name: /delete/i}))

    expect(
      screen.getByRole('cell', {name: /paracetomal 1/i}),
    ).toBeInTheDocument()
  })
})
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

async function searchDrug(drugName: string, times: Number = 0) {
  const searchBox = screen.getByRole('searchbox', {name: /searchdrugs/i})
  userEvent.type(searchBox, drugName)
  await waitForApiCalls({
    apiURL: REST_ENDPOINTS.DRUG_SEARCH,
    times: times,
  })
}

async function waitForMedicationConfig() {
  await waitForApiCalls({
    apiURL: CONFIG_URLS.MEDICATION_CONFIG,
    times: 1,
  })
}

async function waitForConfigurationLoad() {
  await waitForApiCalls({
    apiURL: REST_ENDPOINTS.DRUG_ORDER_CONFIG,
    times: 1,
  })
}

async function waitForSaveMedicationLoad() {
  adapter.onGet(REST_ENDPOINTS.PROVIDER).reply(200, mockProviderResponse)
  adapter
    .onGet(REST_ENDPOINTS.ENCOUNTER_TYPE)
    .reply(200, mockEncounterTypeResponse)
  adapter.onGet(REST_ENDPOINTS.VISIT).reply(200, mockVisitTypeResponse)
  when(useProviderName).mockReturnValue('superman')
  when(useUserLocationUuid).mockReturnValue('locationUuid')
  when(getPatientUuid).mockReturnValue('patientUuid')
}

async function saveMedication() {
  await waitForMedicationConfig()
  await searchDrug('Par', 2)

  userEvent.click(screen.getByText(/paracetomal 1/i))

  await fillingDosageInstructions()

  userEvent.click(screen.getByRole('button', {name: /save/i}))
}

function renderWithContextProvider(children) {
  return render(
    <StoppedPrescriptionsProvider>{children}</StoppedPrescriptionsProvider>,
  )
}
