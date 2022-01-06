import {render, waitFor, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {when} from 'jest-when'
import React from 'react'
import {search} from './services/drugs'
import MedicationApp from './index'
import {
  mockActivePrescriptionResponse,
  mockDrugOrderConfigApiResponse,
  mockDrugsApiResponse,
} from './utils/tests-utils/mockApiContract'
import {axe} from 'jest-axe'
import {
  fetchDrugOrderConfig,
  getActivePrescription,
} from './services/bahmnicore'
import {getPatientUuid} from './utils/helper'

jest.mock('./services/drugs', () => ({
  __esModule: true,
  search: jest.fn(),
}))

jest.mock('./services/bahmnicore', () => ({
  __esModule: true,
  fetchDrugOrderConfig: jest.fn(),
  getActivePrescription: jest.fn(),
}))

jest.mock('./utils/helper', () => ({
  __esModule: true,
  getPatientUuid: jest.fn(),
}))

Element.prototype.scrollIntoView = jest.fn()

beforeEach(async () => {
  when(fetchDrugOrderConfig)
    .calledWith()
    .mockResolvedValue(mockDrugOrderConfigApiResponse)
  when(getActivePrescription).mockResolvedValue(mockActivePrescriptionResponse)
  when(getPatientUuid).mockReturnValue('patientUuid123')
})

test('should pass hygene accessibility tests', async () => {
  const {container} = render(<MedicationApp />)
  await waitForConfigurationLoad()

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
    await waitForConfigurationLoad()

    await searchDrug('Par')

    expect(screen.getByText(/paracetomal 1/i)).toBeInTheDocument()
    expect(screen.getByText(/paracetomal 2/i)).toBeInTheDocument()
  })

  it('should not show any results when user input have no matching drugs', async () => {
    when(search)
      .calledWith('bogus')
      .mockResolvedValue(mockDrugsApiResponse.emptyResponse)
    render(<MedicationApp />)
    await waitForConfigurationLoad()

    await searchDrug('bogus')

    expect(screen.queryByTestId(/drugDataId/i)).toBeNull()
  })

  it('should require user to enter minimum 2 character for searching drugs', async () => {
    when(search)
      .calledWith('Pa')
      .mockResolvedValue(mockDrugsApiResponse.validResponse)
    render(<MedicationApp />)
    await waitForConfigurationLoad()

    const searchBox = screen.getByRole('searchbox', {name: /searchdrugs/i})

    userEvent.type(searchBox, 'P')
    await waitFor(() => expect(search).not.toBeCalled())
    expect(screen.queryByTestId(/drugDataId/i)).toBeNull()

    userEvent.type(searchBox, 'a')
    await waitFor(() => expect(search).toBeCalledTimes(1))
    expect(screen.getByText(/paracetomal 1/i)).toBeInTheDocument()
    expect(screen.getByText(/paracetomal 2/i)).toBeInTheDocument()
  })

  it('should display all the tabs', async () => {
    render(<MedicationApp />)
    await waitForConfigurationLoad()

    expect(
      screen.getByRole('tab', {
        name: /active prescription/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('tab', {
        name: /schedule/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('tab', {
        name: /show all/i,
      }),
    ).toBeInTheDocument()
  })

  it('should display prescription table headers', async () => {
    render(<MedicationApp />)
    await waitForConfigurationLoad()

    expect(screen.getByText(/Active Prescription/i)).toBeInTheDocument()
    expect(screen.getByText(/Scheduled Prescription/i)).toBeInTheDocument()
    expect(screen.getByText(/Show all/i)).toBeInTheDocument()
  })

  //FIXME: should rewrite the test - would need code refactor - SOC violation
  it.skip('should display active prescription table when user clicks on active prescription tab', async () => {
    render(<MedicationApp />)
    await waitForConfigurationLoad()

    userEvent.click(
      screen.getByRole('tab', {
        name: /schedule/i,
      }),
    )
    expect(screen.getByTestId('activePrescription')).not.toBeVisible()

    userEvent.click(
      screen.getByRole('tab', {
        name: /active prescription/i,
      }),
    )
    expect(screen.getByTestId('activePrescription')).toBeVisible()
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
    await waitForConfigurationLoad()
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
    await waitForConfigurationLoad()

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
    await waitForConfigurationLoad()
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

async function searchDrug(drugName: string) {
  const searchBox = screen.getByRole('searchbox', {name: /searchdrugs/i})
  userEvent.type(searchBox, drugName)
  await waitFor(() => expect(search).toBeCalledTimes(drugName.length - 1))
}

async function waitForConfigurationLoad() {
  await waitFor(() => expect(fetchDrugOrderConfig).toBeCalled())
}
