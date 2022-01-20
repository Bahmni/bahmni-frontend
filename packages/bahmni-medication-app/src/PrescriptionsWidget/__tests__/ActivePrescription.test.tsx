import {render, screen} from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter/types'
import {axe} from 'jest-axe'
import {when} from 'jest-when'
import React from 'react'
import ActivePrescription from '../ActivePrescription'
import {getPatientUuid, getDrugInfo} from '../../utils/helper'
import {initMockApi} from '../../utils/tests-utils/baseApiSetup'
import {mockActivePrescriptionResponse} from '../../utils/tests-utils/mockApiContract'
import {REST_ENDPOINTS} from '../../utils/constants'

jest.mock('../../utils/helper', () => {
  const originalModule = jest.requireActual('../../utils/helper')
  return {
    __esModule: true,
    ...originalModule,
    getPatientUuid: jest.fn(),
  }
})

let adapter: MockAdapter, waitForApiCalls: Function, apiParams: Function

afterEach(() => {
  jest.clearAllMocks()
})

test('should pass hygene accessibility tests', async () => {
  const {container} = render(<ActivePrescription />)
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

    render(<ActivePrescription />)

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

    render(<ActivePrescription />)

    await waitForApiCalls({
      apiURL: REST_ENDPOINTS.ACTIVE_PRESCRIPTION,
      times: 1,
    })
    expect(
      screen.queryByRole('table', {name: /prescription/i}),
    ).not.toBeInTheDocument()
  })

  it('should not show active prescription table when there are no active prescription for the patient', async () => {
    when(getPatientUuid).mockReturnValue('patientUuid')
    adapter.onGet(REST_ENDPOINTS.ACTIVE_PRESCRIPTION).reply(200, [])

    render(<ActivePrescription />)
    await waitForApiCalls({
      apiURL: REST_ENDPOINTS.ACTIVE_PRESCRIPTION,
      times: 1,
    })
    expect(
      screen.queryByRole('table', {name: /prescription/i}),
    ).not.toBeInTheDocument()
  })
})
