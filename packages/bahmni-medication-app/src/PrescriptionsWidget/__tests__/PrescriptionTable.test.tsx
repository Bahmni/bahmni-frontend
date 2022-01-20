import {render, screen} from '@testing-library/react'
import {axe} from 'jest-axe'
import React from 'react'
import {headerData} from '../../utils/constants'
import {
  mockAllPrescriptionResponse,
  mockPrescriptionResponse,
  mockPrescriptionResponseForNonCodedDrug,
} from '../../utils/tests-utils/mockApiContract'
import PrescriptionTable from '../PrescriptionTable'

test('should pass hygene accessibility tests', async () => {
  const {container} = render(
    <PrescriptionTable data={mockPrescriptionResponse} />,
  )
  expect(await axe(container)).toHaveNoViolations()
})

describe('Prescription Table', () => {
  it('should display all the heading', () => {
    render(<PrescriptionTable data={mockPrescriptionResponse} />)
    headerData.map(i => {
      expect(screen.getByText(i)).toBeInTheDocument()
    })
  })

  it('should display prescriptions categorised by date prescribed', () => {
    render(<PrescriptionTable data={mockPrescriptionResponse} />)
    mockPrescriptionResponse.forEach(response => {
      expect(
        screen.getByRole('row', {
          name: new Date(response.dateActivated).toLocaleDateString(),
        }),
      ).toBeInTheDocument()
    })
  })

  it('should display drug and provider information', () => {
    render(<PrescriptionTable data={mockPrescriptionResponse} />)
    expect(
      screen.getByRole('cell', {name: /Aspirin 1, Tablet, Oral/i}),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('cell', {
        name: /5 Capsule\(s\), Thrice a day for 5 Day\(s\) started on 12\/22\/2021 by Super Man/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('cell', {name: /150 Capsule\(s\)/i}),
    ).toBeInTheDocument()
  })

  it('should display non coded drug name', () => {
    render(<PrescriptionTable data={mockPrescriptionResponseForNonCodedDrug} />)
    expect(screen.getByRole('cell', {name: /Paz/i})).toBeInTheDocument()
    expect(
      screen.getByRole('cell', {
        name: /5 Capsule\(s\), Thrice a day for 5 Day\(s\) started on 12\/22\/2021 by Super Man/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('cell', {name: /150 Capsule\(s\)/i}),
    ).toBeInTheDocument()
  })

  it('should display instructions for prescriptions', () => {
    render(<PrescriptionTable data={mockPrescriptionResponse} />)
    expect(
      screen.getByRole('cell', {name: /As directed Test Data/i}),
    ).toBeInTheDocument()
  })

  it('should display status as active for active prescription', () => {
    render(<PrescriptionTable data={mockAllPrescriptionResponse.active} />)
    const statusCell = screen.getByRole('cell', {name: 'active'})
    expect(statusCell).toBeInTheDocument()
    expect(statusCell).toHaveStyle('color:orange;')
  })

  it('should display status as scheduled for scheduled prescription', () => {
    render(<PrescriptionTable data={mockAllPrescriptionResponse.scheduled} />)
    const statusCell = screen.getByRole('cell', {name: 'scheduled'})
    expect(statusCell).toBeInTheDocument()
    expect(statusCell).toHaveStyle('color:green;')
  })

  it('should display status as stopped for stopped prescription', () => {
    render(<PrescriptionTable data={mockAllPrescriptionResponse.stopped} />)
    expect(screen.getByRole('cell', {name: 'stopped'})).toBeInTheDocument()
  })

  it('should strikethorugh drug info and schedule text for stopped prescription', () => {
    render(<PrescriptionTable data={mockAllPrescriptionResponse.stopped} />)

    expect(screen.getByRole('cell', {name: /Aspirin 4*/i})).toHaveStyle(
      'text-decoration:line-through;',
    )
    expect(
      screen.getByRole('cell', {
        name: /5 Capsule\(s\), Thrice a day for 5 Day\(s\) started on 12\/22\/2021 by Super Man/i,
      }),
    ).toHaveStyle('text-decoration:line-through;')
  })

  it('should display status as finished for finished prescription', () => {
    render(<PrescriptionTable data={mockAllPrescriptionResponse.finished} />)
    expect(screen.getByRole('cell', {name: 'finished'})).toBeInTheDocument()
  })

  it('should show revise,stop and renew actions for active prescription', () => {
    render(<PrescriptionTable data={mockAllPrescriptionResponse.active} />)
    expect(
      screen.getByRole('cell', {name: /revise stop renew/i}),
    ).toBeInTheDocument()
  })

  it('should show revise,stop and renew actions for scheduled prescription', () => {
    render(<PrescriptionTable data={mockAllPrescriptionResponse.scheduled} />)
    expect(
      screen.getByRole('cell', {name: /revise stop renew/i}),
    ).toBeInTheDocument()
  })

  it('should show only add action for stopped prescription', () => {
    render(<PrescriptionTable data={mockAllPrescriptionResponse.stopped} />)
    expect(screen.getByRole('cell', {name: /add/i})).toBeInTheDocument()
  })
  it('should show only add action for finished prescription', () => {
    render(<PrescriptionTable data={mockAllPrescriptionResponse.finished} />)
    expect(screen.getByRole('cell', {name: /add/i})).toBeInTheDocument()
  })
})
