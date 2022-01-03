import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('should show error message when user enter drugs Quantity less then 0', () => {
    render(<PrescriptionDialog drug={mockDrug} onClose={() => {}}></PrescriptionDialog>);
    const quantityInput = screen.getByLabelText('Quantity');
    userEvent.type(quantityInput, '-1');
    expect(screen.getByText(/quantity cannot be less than 0/i)).toBeInTheDocument();
  });

  it('should show error message when user enter drugs Dosage less then 0', () => {
    render(<PrescriptionDialog drug={mockDrug} onClose={() => {}}></PrescriptionDialog>);
    const dosageInput = screen.getByLabelText('Dosage');
    userEvent.type(dosageInput, '-1');
    expect(screen.getByText(/dosage cannot be less than 0/i)).toBeInTheDocument();
  });

  it('should show error message when user enter drugs Duration less then 0', () => {
    render(<PrescriptionDialog drug={mockDrug} onClose={() => {}}></PrescriptionDialog>);
    const durationInput = screen.getByLabelText('Duration');
    userEvent.type(durationInput, '-1');
    expect(screen.getByText(/duration cannot be less than 0/i)).toBeInTheDocument();
  });

  it('should not allow user to select past date as prescription start date', () => {
    function getFormatedDate(addDays: number): string {
      let date = new Date();
      date.setDate(date.getDate() + addDays);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    render(<PrescriptionDialog drug={mockDrug} onClose={() => {}}></PrescriptionDialog>);
    const startDateInput = screen.getByLabelText('Start Date');
    userEvent.click(startDateInput);

    const currentDay = screen.getByLabelText(getFormatedDate(0));
    const pastDate = screen.getByLabelText(getFormatedDate(-1));

    expect(currentDay.className).not.toMatch(/-disabled/i);
    expect(pastDate.className).toMatch(/-disabled/i);
  });
});
