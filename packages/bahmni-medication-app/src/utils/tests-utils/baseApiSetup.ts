import MockAdapter from 'axios-mock-adapter'
import {api} from '../../services/axios'
import {waitFor} from '@testing-library/react'

export function initMockApi() {
  let adapter = new MockAdapter(api)

  type ApiCallsNamedArguments = {apiURL: string; times: number}
  const waitForApiCalls = async ({apiURL, times = 0}: ApiCallsNamedArguments) =>
    await waitFor(() =>
      expect(adapter.history.get.filter(api => api.url === apiURL).length).toBe(
        times,
      ),
    )

  const apiParams = (apiURL: string) =>
    adapter.history.get.filter(api => api.url === apiURL).map(api => api.params)

  return {adapter, waitForApiCalls, apiParams}
}
