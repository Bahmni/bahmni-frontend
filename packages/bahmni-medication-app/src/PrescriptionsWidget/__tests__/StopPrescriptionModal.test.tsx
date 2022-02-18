import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {axe} from 'jest-axe'
import React from 'react'
import {stopReasons} from '../../utils/constants'
import {getDrugInfo} from '../../utils/helper'
import {mockActivePrescriptionResponse} from '../../utils/tests-utils/mockApiContract'
import StopPrescriptionModal from '../StopPrescriptionModal'

test('should pass hygene accessibility tests', async () => {
  const {container} = render(
    <StopPrescriptionModal
      prescription={mockActivePrescriptionResponse[0]}
      onClose={() => {}}
    />,
  )
  expect(await axe(container)).toHaveNoViolations()
})

describe('Stop Prescription Modal', () => {
  it('should show input controls for StopDate, Reason and Notes', () => {
    render(
      <StopPrescriptionModal
        prescription={mockActivePrescriptionResponse[0]}
        onClose={() => {}}
      />,
    )
    expect(screen.getByLabelText(/Stop Date/i)).toBeInTheDocument()
    expect(
      screen.getByRole('combobox', {
        name: /stop reason/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
  })

  it('should display selected drug info', () => {
    render(
      <StopPrescriptionModal
        prescription={mockActivePrescriptionResponse[0]}
        onClose={() => {}}
      />,
    )
    expect(
      screen.getByText(getDrugInfo(mockActivePrescriptionResponse[0])),
    ).toBeInTheDocument()
  })

  it('should not allow user to select past date as prescription stop date', async () => {
    render(
      <StopPrescriptionModal
        prescription={mockActivePrescriptionResponse[0]}
        onClose={() => {}}
      ></StopPrescriptionModal>,
    )

    const stopDateInput = screen.getByLabelText('Stop Date')
    userEvent.click(stopDateInput)

    const currentDay = screen.getByLabelText(getFormatedDate(0))
    const pastDate = screen.getByLabelText(getFormatedDate(-1))

    expect(currentDay.className).not.toMatch(/-disabled/i)
    expect(pastDate.className).toMatch(/-disabled/i)
  })

  it('should not allow user to select a date greater than effective stop date as prescription stop date', async () => {
    render(
      <StopPrescriptionModal
        prescription={mockActivePrescriptionResponse[0]}
        onClose={() => {}}
      ></StopPrescriptionModal>,
    )

    const stopDateInput = screen.getByLabelText('Stop Date')
    userEvent.click(stopDateInput)

    const effectiveStopDate = new Date(
      mockActivePrescriptionResponse[0].effectiveStopDate,
    )
    const effectiveStopDateElement = screen.getByLabelText(
      formatDate(effectiveStopDate),
    )
    effectiveStopDate.setDate(effectiveStopDate.getDate() + 1)
    const nextDateToEffectiveStopDateElement = screen.getByLabelText(
      formatDate(effectiveStopDate),
    )

    expect(effectiveStopDateElement.className).not.toMatch(/-disabled/i)
    expect(nextDateToEffectiveStopDateElement.className).toMatch(/-disabled/i)

    function formatDate(date: Date): string {
      return date.toLocaleDateString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
  })

  it('should display stop reason from constants when user clicks on stop reason dropdown', async () => {
    render(
      <StopPrescriptionModal
        prescription={mockActivePrescriptionResponse[0]}
        onClose={() => {}}
      ></StopPrescriptionModal>,
    )

    userEvent.click(
      screen.getByRole('combobox', {
        name: /stop reason/i,
      }),
    )
    stopReasons.forEach(reason => {
      expect(screen.getByText(reason)).toBeInTheDocument()
    })
  })

  it('should pass stopped info when user clicks done', () => {
    const onClose = jest.fn()
    render(
      <StopPrescriptionModal
        prescription={mockActivePrescriptionResponse[0]}
        onClose={onClose}
      ></StopPrescriptionModal>,
    )
    const stopDateInput = screen.getByLabelText('Stop Date')
    userEvent.click(stopDateInput)

    const currentDay = screen.getByLabelText(getFormatedDate(0))
    userEvent.click(currentDay)
    userEvent.click(
      screen.getByRole('combobox', {
        name: /stop reason/i,
      }),
    )
    userEvent.click(screen.getByText(stopReasons[0]))
    userEvent.type(screen.getByLabelText(/notes/i), 'Sample Text')
    userEvent.click(
      screen.getByRole('button', {
        name: /Done/i,
      }),
    )

    expect(onClose).toBeCalledWith({
      notes: 'Sample Text',
      reason: stopReasons[0],
      //TODO Find a way to expect on the date selected
      stopDate: expect.any(Date),
    })
  })

  it('should disable Done button when stop date is empty', () => {
    render(
      <StopPrescriptionModal
        prescription={mockActivePrescriptionResponse[0]}
        onClose={() => {}}
      ></StopPrescriptionModal>,
    )
    const stopDateInput = screen.getByLabelText('Stop Date')
    userEvent.clear(stopDateInput)
    userEvent.type(screen.getByLabelText(/notes/i), '')

    expect(
      screen.getByRole('button', {
        name: /Done/i,
      }),
    ).toBeDisabled()
  })
  it('should pass null when user clicks cancel', () => {
    const onClose = jest.fn()
    render(
      <StopPrescriptionModal
        prescription={mockActivePrescriptionResponse[0]}
        onClose={onClose}
      ></StopPrescriptionModal>,
    )
    userEvent.click(
      screen.getByRole('button', {
        name: /cancel/i,
      }),
    )

    expect(onClose).toBeCalledWith(null)
  })
})

function getFormatedDate(addDays: number): string {
  let date = new Date()
  date.setDate(date.getDate() + addDays)
  return date.toLocaleDateString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
