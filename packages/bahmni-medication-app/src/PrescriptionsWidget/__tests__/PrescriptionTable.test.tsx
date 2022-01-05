import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import ActivePrescription from '../ActivePrescription';
import { headerData } from '../../utils/constants';
import PrescriptionTable from '../PrescriptionTable';
import { mockActivePrescriptionResponse, mockPrescriptionResponse } from '../../utils/tests-utils/mockApiContract';

test('should pass hygene accessibility tests', async () => {
  const { container } = render(<ActivePrescription />);
  expect(await axe(container)).toHaveNoViolations();
});

describe('Prescription Table', () => {
  it('should display all the heading', () => {
    render(<PrescriptionTable data={mockPrescriptionResponse} />);
    headerData.map((i) => {
      expect(screen.getByText(i)).toBeInTheDocument();
    });
  });

  it('should display drug and provider information', () => {
    render(<PrescriptionTable data={mockPrescriptionResponse} />);
    expect(screen.getByRole('cell', { name: /Aspirin 75mg, Tablet, Oral/i })).toBeInTheDocument();
    expect(
      screen.getByRole('cell', {
        name: /5 Capsule\(s\), Thrice a day for undefined Day\(s\) started on 12\/22\/2021 by Super Man/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /150 Capsule\(s\)/i })).toBeInTheDocument();
  });

  it('should display instructions for active prescription', () => {
    render(<PrescriptionTable data={mockPrescriptionResponse} />);
    expect(screen.getByRole('cell', { name: /As directed Test Data/i })).toBeInTheDocument();
  });

  it('should display status as active for active prescription', () => {
    render(<PrescriptionTable data={mockActivePrescriptionResponse} />);
    expect(screen.getByRole('cell', { name: 'active' })).toBeInTheDocument();
  });

  it('should not display status for in-active prescription', () => {
    render(<PrescriptionTable data={mockPrescriptionResponse} />);
    expect(screen.queryByRole('cell', { name: /active/i })).not.toBeInTheDocument();
  });

  it('should display all the actions', () => {
    render(<PrescriptionTable data={mockPrescriptionResponse} />);
    expect(screen.getByText(/revise/i)).toBeInTheDocument();
    expect(screen.getByText(/stop/i)).toBeInTheDocument();
    expect(screen.getByText(/renew/i)).toBeInTheDocument();
  });
});
