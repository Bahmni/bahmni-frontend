import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { when } from 'jest-when';
import React from 'react';
import ActivePrescription from '../ActivePrescription';
import { getActivePrescription } from '../api';
import { getPatientUuid } from '../helper';

test('should pass hygene accessibility tests', async () => {
  const { container } = render(<ActivePrescription />);
  expect(await axe(container)).toHaveNoViolations();
});

jest.mock('../helper', () => ({
  __esModule: true,
  getPatientUuid: jest.fn(),
}));

jest.mock('../api', () => ({
  __esModule: true,
  getActivePrescription: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('Prescription', () => {
  it('should call get active prescription once patientUuid exists', async () => {
    when(getPatientUuid).mockReturnValue('patientUuid');

    await waitFor(() => render(<ActivePrescription />));

    expect(getActivePrescription).toBeCalledWith('patientUuid');
    expect(getActivePrescription).toBeCalledTimes(1);
  });

  it('should not call get active prescription once patientUuid is undefined', () => {
    when(getPatientUuid).mockReturnValue('');

    render(<ActivePrescription />);

    expect(getActivePrescription).not.toBeCalled();
  });

  it('should not display table when active prescription data is unavailable', async () => {
    when(getPatientUuid).mockReturnValue('patientUuid');
    when(getActivePrescription).calledWith('patientUuid').mockResolvedValue('');

    await waitFor(() => render(<ActivePrescription />));

    expect(screen.queryByRole('table', { name: /prescription/i })).not.toBeInTheDocument();
  });
});
