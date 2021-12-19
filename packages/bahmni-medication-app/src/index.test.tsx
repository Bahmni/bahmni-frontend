import App from './App';
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { search } from './api';
import { when } from 'jest-when';

const BASE_URL = 'https://demo.mybahmni.org';

jest.mock('./api', () => ({
  __esModule: true,
  search: jest.fn(),
}));
describe('should test App page ', () => {
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
    when(search).calledWith('par').mockResolvedValue(result);
    const { getByTestId, findByText } = render(<App />);
    const input = await waitFor(() => getByTestId('Search Drug'));
    await fireEvent.change(input, {
      target: {
        value: 'par',
      },
    });
    expect(search).toBeCalledTimes(1);
    expect(await findByText('Paracetomal 1')).toBeTruthy();
  });
});
