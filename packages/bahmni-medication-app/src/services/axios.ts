import axios, {AxiosResponse} from 'axios'
import {BASE_URL} from '../utils/constants'

export const api = axios.create({
  // baseURL: process.env.REACT_APP_BASE_URL,
  baseURL: BASE_URL,
  timeout: 15000,
})

export const responseBody = (response: AxiosResponse) => response.data
