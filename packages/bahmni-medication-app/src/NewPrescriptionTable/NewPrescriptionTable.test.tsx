import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {axe} from 'jest-axe'
import React from 'react'
import {newPrescriptionHeader} from '../utils/constants'
import {mockNewPrescription} from '../utils/tests-utils/mockApiContract'
import NewPrescriptionTable from './NewPrescriptionTable'

test('should pass hygene accessibility tests', async () => {
  const {container} = render(
    <NewPrescriptionTable
      newPrescriptions={mockNewPrescription}
      setNewPrescriptions={() => {}}
    />,
  )
  expect(await axe(container)).toHaveNoViolations()
})

describe('New Prescription Table', () => {
  it('should display all the heading', () => {
    render(
      <NewPrescriptionTable
        newPrescriptions={mockNewPrescription}
        setNewPrescriptions={() => {}}
      />,
    )
    newPrescriptionHeader.map(i => {
      expect(screen.getByText(i)).toBeInTheDocument()
    })
  })

  it('should display drug name, dosing instructions and quantity', () => {
    render(
      <NewPrescriptionTable
        newPrescriptions={mockNewPrescription}
        setNewPrescriptions={() => {}}
      />,
    )
    expect(
      screen.getByRole('cell', {name: /Paracetomal 1, Tablet, Oral/i}),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('cell', {
        name: `2 Tablet(s), Immediately for 2 Day(s) starting on ${new Date(
          mockNewPrescription[0].effectiveStartDate,
        ).toLocaleDateString('en')}`,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('cell', {name: /4 Tablet\(s\)/i}),
    ).toBeInTheDocument()
  })

  it('should display all the actions', () => {
    render(
      <NewPrescriptionTable
        newPrescriptions={mockNewPrescription}
        setNewPrescriptions={() => {}}
      />,
    )
    expect(screen.getByRole('cell', {name: /edit/i})).toBeInTheDocument()
    expect(screen.getByRole('img', {name: /favourite/i})).toBeInTheDocument()
    expect(screen.getByRole('img', {name: /delete/i})).toBeInTheDocument()
  })

  it('should open confirm popup on clicking delete action', async () => {
    window.confirm = jest.fn(() => false)
    render(
      <NewPrescriptionTable
        newPrescriptions={mockNewPrescription}
        setNewPrescriptions={() => {}}
      />,
    )
    userEvent.click(screen.getByRole('img', {name: /delete/i}))

    expect(window.confirm).toBeCalled()
  })

  it('should update state on clicking ok in confirm popup ', async () => {
    window.confirm = jest.fn(() => true)
    const setNewPrescriptions = jest.fn()
    render(
      <NewPrescriptionTable
        newPrescriptions={mockNewPrescription}
        setNewPrescriptions={setNewPrescriptions}
      />,
    )

    userEvent.click(screen.getByRole('img', {name: /delete/i}))

    expect(setNewPrescriptions).toBeCalledWith([])
  })

  it('should not update state on clicking cancel in confirm popup ', async () => {
    window.confirm = jest.fn(() => false)
    const setNewPrescriptions = jest.fn()
    render(
      <NewPrescriptionTable
        newPrescriptions={mockNewPrescription}
        setNewPrescriptions={setNewPrescriptions}
      />,
    )

    userEvent.click(screen.getByRole('img', {name: /delete/i}))

    expect(setNewPrescriptions).not.toBeCalled()
  })
})
