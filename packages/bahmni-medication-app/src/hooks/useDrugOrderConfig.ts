import {useEffect} from 'react'
import {useAsync} from 'react-async'
import createPersistedState from 'use-persisted-state'
import {fetchDrugOrderConfig} from '../services/bahmnicore'
import {DrugOrderConfig} from '../types'
const useDrugOrderConfigState = createPersistedState(
  'bahmniDrugOrderConfig',
  sessionStorage,
)

const useDrugOrderConfig = (): {
  isLoading: boolean
  drugOrderConfig: DrugOrderConfig
  error: any
} => {
  const [drugOrderConfig, setDrugOrderConfig] = useDrugOrderConfigState()
  const {
    run: getDrugOrderConfig,
    error,
    isLoading,
  } = useAsync<any>({
    deferFn: fetchDrugOrderConfig,
    onResolve: data => setDrugOrderConfig(data),
  })
  useEffect(() => {
    if (!drugOrderConfig) {
      getDrugOrderConfig()
    }
  }, [])
  return {
    isLoading: isLoading,
    error: error,
    drugOrderConfig: drugOrderConfig,
  }
}

export default useDrugOrderConfig
