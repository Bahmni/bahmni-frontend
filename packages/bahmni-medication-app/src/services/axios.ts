import axios, {AxiosResponse} from 'axios'

const BASE_URL = ''
export const api = axios.create({
  // baseURL: process.env.REACT_APP_BASE_URL,
  baseURL: BASE_URL,
  timeout: 15000,
})

export const responseBody = (response: AxiosResponse) => response.data
