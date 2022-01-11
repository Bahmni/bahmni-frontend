import {useEffect} from 'react'
import {useAsync} from 'react-async'
import createPersistedState from 'use-persisted-state'
import {fetchMedicationConfig} from '../services/config'
const useMedicationConfigState = createPersistedState(
  'medicationConfig',
  sessionStorage,
)

const useMedicationConfig = (): {
  isMedicationConfigLoading: boolean
  medicationConfig: any
  medicationConfigError: any
} => {
  const [medicationConfig, setMedicationConfig] = useMedicationConfigState()
  const {
    run: getMedicationConfig,
    error,
    isLoading,
  } = useAsync<any>({
    deferFn: fetchMedicationConfig,
    onResolve: data => setMedicationConfig(window.btoa(JSON.stringify(data))),
  })
  useEffect(() => {
    if (!medicationConfig) {
      getMedicationConfig()
    }
  }, [])
  return {
    isMedicationConfigLoading: isLoading,
    medicationConfigError: error,
    medicationConfig: medicationConfig
      ? JSON.parse(window.atob(medicationConfig))
      : medicationConfig,
  }
}

export default useMedicationConfig
