import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {axe} from 'jest-axe'
import React from 'react'
import {stopReasons} from '../../utils/constants'
import StopPrescripotionModal from '../StopPrescriptionModal'

test('should pass hygene accessibility tests', async () => {
  const {container} = render(
    <StopPrescripotionModal drugInfo={'Test Drug'} onClose={() => {}} />,
  )
  expect(await axe(container)).toHaveNoViolations()
})

describe('Stop Prescription Modal', () => {
  it('should show input controls for StopDate, Reason and Notes', () => {
    render(<StopPrescripotionModal drugInfo={'Test Drug'} onClose={() => {}} />)
    expect(screen.getByLabelText(/Stop Date/i)).toBeInTheDocument()
    expect(
      screen.getByRole('combobox', {
        name: /stop reason/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
  })
  it('should display selected drug info', () => {
    render(<StopPrescripotionModal drugInfo={'Test Drug'} onClose={() => {}} />)
    expect(screen.getByText(/Test Drug/i)).toBeInTheDocument()
  })
  it('should not allow user to select past date as prescription stop date', async () => {
    render(
      <StopPrescripotionModal
        drugInfo={'Test Drug'}
        onClose={() => {}}
      ></StopPrescripotionModal>,
    )

    const stopDateInput = screen.getByLabelText('Stop Date')
    userEvent.click(stopDateInput)

    const currentDay = screen.getByLabelText(getFormatedDate(0))
    const pastDate = screen.getByLabelText(getFormatedDate(-1))

    expect(currentDay.className).not.toMatch(/-disabled/i)
    expect(pastDate.className).toMatch(/-disabled/i)
  })
  it('should display stop reason from constans when user clicks on stop reason dropdown', async () => {
    render(
      <StopPrescripotionModal
        drugInfo={'Test Drug'}
        onClose={() => {}}
      ></StopPrescripotionModal>,
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
      <StopPrescripotionModal
        drugInfo={'Test Drug'}
        onClose={onClose}
      ></StopPrescripotionModal>,
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

    expect(onClose).toBeCalledWith(
      expect.objectContaining({
        notes: 'Sample Text',
        reason: stopReasons[0],
        //TODO Find a way to expect on the date selected
        stopDate: expect.any(Date),
      }),
    )
  })
  it('should pass null when user clicks cancel', () => {
    const onClose = jest.fn()
    render(
      <StopPrescripotionModal
        drugInfo={'Test Drug'}
        onClose={onClose}
      ></StopPrescripotionModal>,
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
