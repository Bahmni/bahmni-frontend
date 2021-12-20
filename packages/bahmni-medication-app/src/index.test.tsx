import App from './App';
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { search } from './api';
import { when } from 'jest-when';

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
    const { getByTestId, findByText, findAllByTestId } = render(<App />);
    const input = await getByTestId('Search Drug');
    await fireEvent.change(input, {
      target: {
        value: 'Par',
      },
    });
    expect(search).toBeCalledTimes(1);
    expect(await findAllByTestId('Clickable Tile')).toBeTruthy();
    expect(await findByText('Paracetomal 1')).toBeTruthy();
  });

  it('should not render Clickable tile when there is no suggestions', async () => {
    const result = {
      results: [],
    };
    when(search).calledWith('par').mockResolvedValue(result);
    const { getByTestId, queryByTestId } = render(<App />);
    const input = await waitFor(() => getByTestId('Search Drug'));
    await fireEvent.change(input, {
      target: {
        value: 'par',
      },
    });
    expect(search).toBeCalledTimes(1);
    expect(queryByTestId('Clickable Tile')).toBeNull();
  });

  it('should not return drugs when input length is less than 2', async () => {
    const { getByTestId } = render(<App />);
    const input = await waitFor(() => getByTestId('Search Drug'));
    await fireEvent.change(input, {
      target: {
        value: 'p',
      },
    });
    expect(search).toBeCalledTimes(0);
  });
});
