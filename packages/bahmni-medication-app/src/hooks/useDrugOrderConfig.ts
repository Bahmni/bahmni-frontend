import {useEffect, useState} from 'react'
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
  const [isLoading, setIsLoading] = useState<boolean>(!drugOrderConfig)
  const [error, setError] = useState()
  useEffect(() => {
    if (!drugOrderConfig)
      fetchDrugOrderConfig()
        .then(drugOrderConfig => {
          setDrugOrderConfig(drugOrderConfig)
          setIsLoading(false)
        })
        .catch(error => {
          setIsLoading(false)
          setError(error)
        })
  }, [])
  return {
    isLoading: isLoading,
    error: error,
    drugOrderConfig: drugOrderConfig,
  }
}

export default useDrugOrderConfig
