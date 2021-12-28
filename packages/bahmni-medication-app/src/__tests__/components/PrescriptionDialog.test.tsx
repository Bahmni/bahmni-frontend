import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import PrescriptionDialog from '../../components/PrescriptionDialog';
import { mockDrugsApiResponse } from '../mockHelper';

const mockDrug = mockDrugsApiResponse.validResponse.results[0];

test('should pass hygene accessibility tests', async () => {
  const { container } = render(<PrescriptionDialog drug={mockDrug} onClose={() => {}}></PrescriptionDialog>);
  expect(await axe(container)).toHaveNoViolations();
});

describe('Medication Tab - Prescription Dialog', () => {
  it('should display prescription details input controls', () => {
    render(<PrescriptionDialog drug={mockDrug} onClose={() => {}}></PrescriptionDialog>);

    expect(screen.getByText(mockDrug.name)).toBeInTheDocument();
    expect(screen.getByLabelText('Dosage')).toBeInTheDocument();
    expect(screen.getByLabelText('Dosage Unit')).toBeInTheDocument();
    expect(
      screen.getByRole('search', {
        name: 'Frequency Search',
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Duration')).toBeInTheDocument();
    expect(screen.getByLabelText('Duration Unit')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
    expect(screen.getByLabelText('Quantity Unit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Route' }));
  });
});
