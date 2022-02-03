import {render, screen} from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter/types'
import {axe} from 'jest-axe'
import {when} from 'jest-when'
import React from 'react'
import AllPrescription from '../AllPrescription'
import {getPatientUuid} from '../../utils/helper'
import {initMockApi} from '../../utils/tests-utils/baseApiSetup'
import {mockPrescriptionResponse} from '../../utils/tests-utils/mockApiContract'
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
  const {container} = renderWithContextProvider(<AllPrescription />)
  await waitForApiCalls({apiURL: REST_ENDPOINTS.ALL_PRESCRIPTION, times: 1})
  expect(await axe(container)).toHaveNoViolations()
})

beforeEach(() => {
  ;({adapter, waitForApiCalls, apiParams} = initMockApi())
})

describe('All Prescription', () => {
  it('should display all prescriptions for a given patient', async () => {
    const mockPatientUuid = 'patientUuid123'
    when(getPatientUuid).mockReturnValue(mockPatientUuid)
    adapter
      .onGet(REST_ENDPOINTS.ALL_PRESCRIPTION)
      .reply(200, mockPrescriptionResponse)

    renderWithContextProvider(<AllPrescription />)

    await waitForApiCalls({
      apiURL: REST_ENDPOINTS.ALL_PRESCRIPTION,
      times: 1,
    })
    expect(
      apiParams(REST_ENDPOINTS.ALL_PRESCRIPTION).some(
        p => p.patientUuid === mockPatientUuid,
      ),
    ).toBeTruthy()
    expect(
      screen.queryByRole('table', {name: /prescription/i}),
    ).toBeInTheDocument()
  })

  it('should not display all prescriptions when the patientId is invalid', async () => {
    when(getPatientUuid).mockReturnValue('someInvalidId')
    adapter.onGet(REST_ENDPOINTS.ALL_PRESCRIPTION).reply(404)

    renderWithContextProvider(<AllPrescription />)

    await waitForApiCalls({
      apiURL: REST_ENDPOINTS.ALL_PRESCRIPTION,
      times: 1,
    })
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('table', {name: /prescription/i}),
    ).not.toBeInTheDocument()
  })

  it('should not show all prescription table when there are no prescription for the patient', async () => {
    when(getPatientUuid).mockReturnValue('patientUuid')
    adapter.onGet(REST_ENDPOINTS.ALL_PRESCRIPTION).reply(200, [])

    renderWithContextProvider(<AllPrescription />)
    await waitForApiCalls({
      apiURL: REST_ENDPOINTS.ALL_PRESCRIPTION,
      times: 1,
    })
    expect(
      screen.queryByRole('table', {name: /prescription/i}),
    ).not.toBeInTheDocument()
  })

  it('should display loading message while fetching all prescription', async () => {
    when(getPatientUuid).mockReturnValue('patientUuid')
    adapter.onGet(REST_ENDPOINTS.ALL_PRESCRIPTION).timeout()

    renderWithContextProvider(<AllPrescription />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    await waitForApiCalls({
      apiURL: REST_ENDPOINTS.ALL_PRESCRIPTION,
      times: 1,
    })

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
})

function renderWithContextProvider(children) {
  return render(
    <StoppedPrescriptionsProvider>{children}</StoppedPrescriptionsProvider>,
  )
}
