import {useEffect} from 'react'
import {useAsync} from 'react-async'
import createPersistedState from 'use-persisted-state'
import {medicationConfig} from '../services/config'
const useMedicationConfigState = createPersistedState(
  'medicationConfig',
  sessionStorage,
)

const useMedicationConfig = (): {
  isLoading: boolean
  configData: any
  configDataError: any
} => {
  const [configData, setConfigData] = useMedicationConfigState()
  const {
    run: getMedicationConfig,
    error,
    isLoading,
  } = useAsync<any>({
    deferFn: medicationConfig,
    onResolve: data => setConfigData(window.btoa(JSON.stringify(data))),
  })
  useEffect(() => {
    if (!configData) {
      getMedicationConfig()
    }
  }, [])
  return {
    isLoading: isLoading,
    configDataError: error,
    configData: configData ? JSON.parse(window.atob(configData)) : configData,
  }
}

export default useMedicationConfig
