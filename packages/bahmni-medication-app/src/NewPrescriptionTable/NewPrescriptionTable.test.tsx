import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {axe} from 'jest-axe'
import React from 'react'
import {newPrescriptionHeader} from '../utils/constants'
import {mockNewPrescription} from '../utils/tests-utils/mockApiContract'
import NewPrescriptionTable from './NewPrescriptionTable'

test('should pass hygene accessibility tests', async () => {
  const {container} = render(
    <NewPrescriptionTable data={mockNewPrescription} setData={() => {}} />,
  )
  expect(await axe(container)).toHaveNoViolations()
})

describe('New Prescription Table', () => {
  it('should display all the heading', () => {
    render(
      <NewPrescriptionTable data={mockNewPrescription} setData={() => {}} />,
    )
    newPrescriptionHeader.map(i => {
      expect(screen.getByText(i)).toBeInTheDocument()
    })
  })

  it('should display drug name, dosing instructions and quantity', () => {
    render(
      <NewPrescriptionTable data={mockNewPrescription} setData={() => {}} />,
    )
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
    render(
      <NewPrescriptionTable data={mockNewPrescription} setData={() => {}} />,
    )
    expect(screen.getByRole('cell', {name: /edit/i})).toBeInTheDocument()
    expect(screen.getByRole('img', {name: /favourite/i})).toBeInTheDocument()
    expect(screen.getByRole('img', {name: /delete/i})).toBeInTheDocument()
  })

  describe('New Prescription Table - delete action', () => {
    it('should open confirm popup on clicking delete action', async () => {
      window.confirm = jest.fn(() => false)
      render(
        <NewPrescriptionTable data={mockNewPrescription} setData={() => {}} />,
      )
      userEvent.click(screen.getByRole('img', {name: /delete/i}))

      expect(window.confirm).toBeCalled()
    })

    it('should update state on clicking ok in confirm popup ', async () => {
      window.confirm = jest.fn(() => true)
      const setData = jest.fn()
      render(
        <NewPrescriptionTable data={mockNewPrescription} setData={setData} />,
      )

      userEvent.click(screen.getByRole('img', {name: /delete/i}))

      expect(setData).toBeCalled()
    })
  })
})
