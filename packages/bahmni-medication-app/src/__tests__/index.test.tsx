import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';
import React from 'react';
import { search } from '../api';
import MedicationApp from '../index';
import { mockDrugsApiResponse } from './mockHelper';
import { axe } from 'jest-axe';

jest.mock('../api', () => ({
  __esModule: true,
  search: jest.fn(),
}));

test('should pass hygene accessibility tests', async () => {
  const { container } = render(<MedicationApp />);
  expect(await axe(container)).toHaveNoViolations();
});

describe('Medication tab - Drugs search', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show matching drugs when user enters valid input in search bar', async () => {
    when(search).calledWith('Par').mockResolvedValue(mockDrugsApiResponse.validResponse);
    render(<MedicationApp />);
    const searchBox = screen.getByRole('searchbox', { name: /searchdrugs/i });

    userEvent.type(searchBox, 'Par');

    await waitFor(() => expect(search).toBeCalledTimes(2));
    expect(screen.getByText(/paracetomal 1/i)).toBeInTheDocument();
    expect(screen.getByText(/paracetomal 2/i)).toBeInTheDocument();
  });

  it('should not show any results when user input have no matching drugs', async () => {
    when(search).calledWith('par').mockResolvedValue(mockDrugsApiResponse.emptyResponse);
    render(<MedicationApp />);
    const searchBox = screen.getByRole('searchbox', { name: /searchdrugs/i });

    userEvent.type(searchBox, 'par');

    await waitFor(() => expect(search).toBeCalledTimes(2));
    expect(screen.queryByTestId(/drugDataId/i)).toBeNull();
  });

  it('should require user to enter minimum 2 character for searching drugs', async () => {
    when(search).calledWith('Pa').mockResolvedValue(mockDrugsApiResponse.validResponse);
    render(<MedicationApp />);
    const searchBox = screen.getByRole('searchbox', { name: /searchdrugs/i });

    userEvent.type(searchBox, 'P');
    await waitFor(() => expect(search).not.toBeCalled());
    expect(screen.queryByTestId(/drugDataId/i)).toBeNull();

    userEvent.type(searchBox, 'a');
    await waitFor(() => expect(search).toBeCalledTimes(1));
    expect(screen.getByText(/paracetomal 1/i)).toBeInTheDocument();
    expect(screen.getByText(/paracetomal 2/i)).toBeInTheDocument();
  });

  it('should show prescription dialog when user clicks a drug', async () => {
    when(search).calledWith('Par').mockResolvedValue(mockDrugsApiResponse.validResponse);
    render(<MedicationApp />);
    const searchBox = screen.getByRole('searchbox', { name: /searchdrugs/i });
    userEvent.type(searchBox, 'Par');
    await waitFor(() => expect(search).toBeCalledTimes(2));

    expect(screen.queryByTitle('prescriptionDialog')).toBeNull();

    const drugOption = screen.getByText(/paracetomal 1/i);
    userEvent.click(drugOption);

    await waitFor(() => expect(screen.getByTitle('prescriptionDialog')).toBeInTheDocument());
  });
});
