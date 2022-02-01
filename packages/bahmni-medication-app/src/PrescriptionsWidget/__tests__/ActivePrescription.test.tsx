import {render, screen} from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter/types'
import {axe} from 'jest-axe'
import {when} from 'jest-when'
import React from 'react'
import ActivePrescription from '../ActivePrescription'
import {getPatientUuid} from '../../utils/helper'
import {initMockApi} from '../../utils/tests-utils/baseApiSetup'
import {mockActivePrescriptionResponse} from '../../utils/tests-utils/mockApiContract'
import {REST_ENDPOINTS} from '../../utils/constants'
import {StoppedPrescriptionsProvider} from '../../context/StoppedPrescriptionContext'

jest.mock('../../utils/helper', () => ({
  __esModule: true,
  getPatientUuid: jest.fn(),
}))

let adapter: MockAdapter, waitForApiCalls: Function, apiParams: Function

afterEach(() => {
  jest.clearAllMocks()
})

test('should pass hygene accessibility tests', async () => {
  const {container} = renderWithContextProvider(<ActivePrescription />)
  await waitForApiCalls({apiURL: REST_ENDPOINTS.ACTIVE_PRESCRIPTION, times: 1})
  expect(await axe(container)).toHaveNoViolations()
})

beforeEach(() => {
  ;({adapter, waitForApiCalls, apiParams} = initMockApi())
})

describe('Active Prescription', () => {
  it('should display active prescriptions for a given patient', async () => {
    const mockPatientUuid = 'patientUuid123'
    when(getPatientUuid).mockReturnValue(mockPatientUuid)
    adapter
      .onGet(REST_ENDPOINTS.ACTIVE_PRESCRIPTION)
      .reply(200, mockActivePrescriptionResponse)

    renderWithContextProvider(<ActivePrescription />)

    await waitForApiCalls({
      apiURL: REST_ENDPOINTS.ACTIVE_PRESCRIPTION,
      times: 1,
    })
    expect(
      apiParams(REST_ENDPOINTS.ACTIVE_PRESCRIPTION).some(
        p => p.patientUuid === mockPatientUuid,
      ),
    ).toBeTruthy()
    expect(
      screen.queryByRole('table', {name: /prescription/i}),
    ).toBeInTheDocument()
  })

  it('should not display active prescriptions when the patientId is invalid', async () => {
    when(getPatientUuid).mockReturnValue('someInvalidId')
    adapter.onGet(REST_ENDPOINTS.ACTIVE_PRESCRIPTION).reply(404)

    renderWithContextProvider(<ActivePrescription />)

    await waitForApiCalls({
      apiURL: REST_ENDPOINTS.ACTIVE_PRESCRIPTION,
      times: 1,
    })
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('table', {name: /prescription/i}),
    ).not.toBeInTheDocument()
  })

  it('should not show active prescription table when there are no active prescription for the patient', async () => {
    when(getPatientUuid).mockReturnValue('patientUuid')
    adapter.onGet(REST_ENDPOINTS.ACTIVE_PRESCRIPTION).reply(200, [])

    renderWithContextProvider(<ActivePrescription />)
    await waitForApiCalls({
      apiURL: REST_ENDPOINTS.ACTIVE_PRESCRIPTION,
      times: 1,
    })
    expect(
      screen.queryByRole('table', {name: /prescription/i}),
    ).not.toBeInTheDocument()
  })

  it('should display loading message while fetching active prescription', async () => {
    when(getPatientUuid).mockReturnValue('patientUuid')
    adapter.onGet(REST_ENDPOINTS.ACTIVE_PRESCRIPTION).timeout()

    renderWithContextProvider(<ActivePrescription />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    await waitForApiCalls({
      apiURL: REST_ENDPOINTS.ACTIVE_PRESCRIPTION,
      times: 1,
    })
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })

  it('should display prescriptions in descending order based on prescried date', async () => {
    when(getPatientUuid).mockReturnValue('patientUuid')
    adapter
      .onGet(REST_ENDPOINTS.ACTIVE_PRESCRIPTION)
      .reply(200, mockActivePrescriptionResponse)

    renderWithContextProvider(<ActivePrescription />)
    await waitForApiCalls({
      apiURL: REST_ENDPOINTS.ACTIVE_PRESCRIPTION,
      times: 1,
    })

    const dateRows = screen.getAllByTestId(/date-row/)
    expect(dateRows[0]).toHaveTextContent(
      getDateString(mockActivePrescriptionResponse[1].dateActivated),
    )
    expect(dateRows[1]).toHaveTextContent(
      getDateString(mockActivePrescriptionResponse[0].dateActivated),
    )
  })
})

function getDateString(timeStamp: number): string {
  return new Date(timeStamp).toLocaleDateString()
}

function renderWithContextProvider(children) {
  return render(
    <StoppedPrescriptionsProvider>{children}</StoppedPrescriptionsProvider>,
  )
}
