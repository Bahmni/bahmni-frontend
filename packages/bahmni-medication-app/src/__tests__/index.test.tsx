import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';
import React from 'react';
import { fetchDrugOrderConfig, search } from '../api';
import MedicationApp from '../index';
import { mockDrugOrderConfigApiResponse, mockDrugsApiResponse } from './mockHelper';
import { axe } from 'jest-axe';

jest.mock('../api', () => ({
  __esModule: true,
  search: jest.fn(),
  fetchDrugOrderConfig: jest.fn(),
}));

beforeEach(async () => {
  when(fetchDrugOrderConfig).calledWith().mockResolvedValue(mockDrugOrderConfigApiResponse);
});

test('should pass hygene accessibility tests', async () => {
  const { container } = render(<MedicationApp />);
  await waitForConfigurationLoad();

  expect(await axe(container)).toHaveNoViolations();
});

describe('Medication tab - Drugs search', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show matching drugs when user enters valid input in search bar', async () => {
    when(search).calledWith('Par').mockResolvedValue(mockDrugsApiResponse.validResponse);
    render(<MedicationApp />);
    await waitForConfigurationLoad();

    await searchDrug('Par');

    expect(screen.getByText(/paracetomal 1/i)).toBeInTheDocument();
    expect(screen.getByText(/paracetomal 2/i)).toBeInTheDocument();
  });

  it('should not show any results when user input have no matching drugs', async () => {
    when(search).calledWith('bogus').mockResolvedValue(mockDrugsApiResponse.emptyResponse);
    render(<MedicationApp />);
    await waitForConfigurationLoad();

    await searchDrug('bogus');

    expect(screen.queryByTestId(/drugDataId/i)).toBeNull();
  });

  it('should require user to enter minimum 2 character for searching drugs', async () => {
    when(search).calledWith('Pa').mockResolvedValue(mockDrugsApiResponse.validResponse);
    render(<MedicationApp />);
    await waitForConfigurationLoad();

    const searchBox = screen.getByRole('searchbox', { name: /searchdrugs/i });

    userEvent.type(searchBox, 'P');
    await waitFor(() => expect(search).not.toBeCalled());
    expect(screen.queryByTestId(/drugDataId/i)).toBeNull();

    userEvent.type(searchBox, 'a');
    await waitFor(() => expect(search).toBeCalledTimes(1));
    expect(screen.getByText(/paracetomal 1/i)).toBeInTheDocument();
    expect(screen.getByText(/paracetomal 2/i)).toBeInTheDocument();
  });
});

describe('Medication tab - Add Prescription Dialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    when(search).calledWith('Par').mockResolvedValue(mockDrugsApiResponse.validResponse);
  });

  it('should show error notification when drug order config fetch fails', async () => {
    when(fetchDrugOrderConfig).calledWith().mockRejectedValue('Error');
    render(<MedicationApp />);
    await waitForConfigurationLoad();
    await searchDrug('Par');

    expect(screen.queryByTitle('prescriptionDialog')).toBeNull();

    const drugOption = screen.getByText(/paracetomal 1/i);
    userEvent.click(drugOption);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('should show prescription dialog when user clicks a drug', async () => {
    render(<MedicationApp />);
    await waitForConfigurationLoad();
    await searchDrug('Par');

    expect(screen.queryByTitle('prescriptionDialog')).toBeNull();

    const drugOption = screen.getByText(/paracetomal 1/i);
    userEvent.click(drugOption);

    await waitFor(() => expect(screen.getByTitle('prescriptionDialog')).toBeInTheDocument());
  });

  //FIXME this test would change after implmenting Add Prescription button
  it('should hide prescription dialog when user clicks cancel', async () => {
    render(<MedicationApp />);
    await waitForConfigurationLoad();
    await searchDrug('Par');

    userEvent.click(screen.getByText(/paracetomal 1/i));

    await waitFor(() => expect(screen.getByTitle('prescriptionDialog')).toBeInTheDocument());
    const cancelButton = screen.getByText(/cancel/i);
    userEvent.click(cancelButton);

    expect(screen.queryByTitle('prescriptionDialog')).not.toBeInTheDocument();
  });

  //FIXME Done is currently placeholder and would be implemented in future stories
  it('WIP: should add prescription when user click Done', async () => {
    render(<MedicationApp />);
    await waitForConfigurationLoad();
    await searchDrug('Par');

    userEvent.click(screen.getByText(/paracetomal 1/i));

    await waitFor(() => expect(screen.getByTitle('prescriptionDialog')).toBeInTheDocument());
    const doneButton = screen.getByText(/done/i);
    userEvent.click(doneButton);

    expect(screen.queryByTitle('prescriptionDialog')).not.toBeInTheDocument();
  });
});

async function searchDrug(durgName: string) {
  const searchBox = screen.getByRole('searchbox', { name: /searchdrugs/i });
  userEvent.type(searchBox, durgName);
  await waitFor(() => expect(search).toBeCalledTimes(durgName.length - 1));
}

async function waitForConfigurationLoad() {
  await waitFor(() => expect(fetchDrugOrderConfig).toBeCalled());
}
