import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';
import React from 'react';
import { search } from './api';
import App from './App';

const BASE_URL = 'https://demo.mybahmni.org';

jest.mock('./api', () => ({
  __esModule: true,
  search: jest.fn(),
}));
describe('should test Medication page ', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render Search Bar', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('Search Drug')).toBeTruthy();
  });

  it('should return drugs based on the input', async () => {
    const result = {
      results: [
        {
          uuid: 1,
          name: 'Paracetomal 1',
        },
        {
          uuid: 2,
          name: 'Paracetomal 2',
        },
      ],
    };
    when(search).calledWith('Par').mockResolvedValue(result);
    const { getByTestId, queryAllByTestId, queryByText } = render(<App />);
    const input = await getByTestId('Search Drug');

    userEvent.type(input, 'Par');

    await waitFor(() => {
      expect(search).toBeCalledTimes(2);
      expect(queryAllByTestId('Clickable Tile')).toBeTruthy();
      expect(queryByText('Paracetomal 1')).toBeTruthy();
    });
  });

  it('should not render Clickable tile when there is no suggestions', async () => {
    const result = {
      results: [],
    };
    when(search).calledWith('pa').mockResolvedValue(result);
    const { getByTestId, queryByTestId } = render(<App />);
    const input = await getByTestId('Search Drug');

    userEvent.type(input, 'pa');

    await waitFor(() => {
      expect(search).toBeCalledTimes(1);
      expect(queryByTestId('Clickable Tile')).toBeNull();
    });
  });

  it('should not return drugs when input length is less than 2', async () => {
    const { getByTestId } = render(<App />);
    const input = await getByTestId('Search Drug');

    userEvent.type(input, 'p');

    await waitFor(() => {
      expect(search).toBeCalledTimes(0);
    });
  });
});
