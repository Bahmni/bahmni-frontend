import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter/types'
import {axe} from 'jest-axe'
import {when} from 'jest-when'
import React from 'react'
import {REST_ENDPOINTS} from '../utils/constants'
import {useProviderName, useUserLocationUuid} from '../utils/cookie'
import {getPatientUuid} from '../utils/helper'
import {initMockApi} from '../utils/tests-utils/baseApiSetup'
import {
  mockEncounterTypeResponse,
  mockNewPrescription,
  mockProviderResponse,
  mockVisitTypeResponse,
} from '../utils/tests-utils/mockApiContract'
import SaveMedication from './SaveMedication'

Element.prototype.scrollIntoView = jest.fn()
let adapter: MockAdapter, waitForApiCalls: Function, apiParams: Function
;({adapter, waitForApiCalls, apiParams} = initMockApi())

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

test('should pass hygene accessibility tests', async () => {
  const {container} = render(
    <SaveMedication
      newPrescription={mockNewPrescription}
      onSaveSuccess={() => {}}
    />,
  )
  await waitFor(async () => {
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Medication tab - Save New Prescription', () => {
  beforeEach(() => {
    adapter.onGet(REST_ENDPOINTS.PROVIDER).reply(200, mockProviderResponse)
    adapter
      .onGet(REST_ENDPOINTS.ENCOUNTER_TYPE)
      .reply(200, mockEncounterTypeResponse)
    adapter.onGet(REST_ENDPOINTS.VISIT).reply(200, mockVisitTypeResponse)
    when(useProviderName).mockReturnValue('superman')
    when(useUserLocationUuid).mockReturnValue('locationUuid')
    when(getPatientUuid).mockReturnValue('patientUuid')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should able to view save button', async () => {
    render(
      <SaveMedication
        newPrescription={mockNewPrescription}
        onSaveSuccess={() => {}}
      />,
    )
    await waitFor(() => {
      expect(screen.getByRole('button', {name: /save/i})).toBeInTheDocument()
    })
  })

  it('should display success message on adding new prescription', async () => {
    render(
      <SaveMedication
        newPrescription={mockNewPrescription}
        onSaveSuccess={() => {}}
      />,
    )

    adapter.onPost(REST_ENDPOINTS.SAVE_NEW_PRESCRIPTION).reply(200)

    userEvent.click(screen.getByRole('button', {name: /save/i}))
    await waitFor(() => {
      expect(screen.getByText(/save successful/i)).toBeInTheDocument()
    })
  })

  it('should display failure message on adding new prescription', async () => {
    render(
      <SaveMedication
        newPrescription={mockNewPrescription}
        onSaveSuccess={() => {}}
      />,
    )

    adapter.onPost(REST_ENDPOINTS.SAVE_NEW_PRESCRIPTION).reply(404)

    userEvent.click(screen.getByRole('button', {name: /save/i}))
    await waitFor(() => {
      expect(screen.getByText(/save failed/i)).toBeInTheDocument()
    })
  })

  it('should display saving prescriptions message on adding new prescription', async () => {
    render(
      <SaveMedication
        newPrescription={mockNewPrescription}
        onSaveSuccess={() => {}}
      />,
    )

    adapter.onPost(REST_ENDPOINTS.SAVE_NEW_PRESCRIPTION).reply(200)

    userEvent.click(screen.getByRole('button', {name: /save/i}))

    expect(screen.getByTitle(/loading/i)).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(/save successful/i)).toBeInTheDocument()
    })
    expect(screen.queryByTitle(/loading/i)).not.toBeInTheDocument()
  })
})
