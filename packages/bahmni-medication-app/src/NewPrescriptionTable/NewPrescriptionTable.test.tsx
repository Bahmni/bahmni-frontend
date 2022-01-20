import {render, screen} from '@testing-library/react'
import {axe} from 'jest-axe'
import React from 'react'
import {newPrescriptionHeader} from '../utils/constants'
import {mockNewPrescription} from '../utils/tests-utils/mockApiContract'
import NewPrescriptionTable from './NewPrescriptionTable'

test('should pass hygene accessibility tests', async () => {
  const {container} = render(
    <NewPrescriptionTable data={mockNewPrescription} />,
  )
  expect(await axe(container)).toHaveNoViolations()
})

describe('New Prescription Table', () => {
  it('should display all the heading', () => {
    render(<NewPrescriptionTable data={mockNewPrescription} />)
    newPrescriptionHeader.map(i => {
      expect(screen.getByText(i)).toBeInTheDocument()
    })
  })

  it('should display drug name, dosing instructions and quantity', () => {
    render(<NewPrescriptionTable data={mockNewPrescription} />)
    expect(
      screen.getByRole('cell', {name: /Paracetomal 1, Tablet, Oral/i}),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('cell', {
        name: /1 Tablet\(s\), Immediately for 1 Day\(s\) starting on 1\/18\/2022/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('cell', {name: /2 Tablet\(s\)/i}),
    ).toBeInTheDocument()
  })

  it('should display all the actions', () => {
    render(<NewPrescriptionTable data={mockNewPrescription} />)
    expect(screen.getByRole('cell', {name: /edit/i})).toBeInTheDocument()
    expect(screen.getByTestId(/favourite/i)).toBeInTheDocument()
    expect(screen.getByTestId(/close/i)).toBeInTheDocument()
  })
})
