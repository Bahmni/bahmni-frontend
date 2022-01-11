import {ClickableTile, Search} from '@bahmni/design-system'
import React, {useEffect, useState} from 'react'
import {useAsync} from 'react-async'
import AddPrescriptionModal from './AddPrescriptionModal/AddPrescriptionModal'
import useMedicationConfig from './hooks/useMedicationConfig'
import {PrescriptionWidget} from './PrescriptionsWidget/PrescriptionWidget'
import {search} from './services/drugs'
import {Drug, DrugResult, NonCodedDrug} from './types'

const styles = {
  container: {
    margin: '1rem 0 0 1rem',
  } as React.CSSProperties,
  search_bar: {
    width: '70%',
  },
  tileList: {
    margin: 'auto',
    overflow: 'scroll',
    maxHeight: '20rem',
  },
}

const MedicationApp = () => {
  const [userInput, setUserInput] = useState('')
  const [isUserInputAvailable, setIsUserInputAvailable] =
    useState<Boolean>(false)
  const [selectedDrug, setSelectedDrug] = useState<Drug | NonCodedDrug>(null)
  const [allowOnlyCodedDrug, setAllowOnlyCodedDrug] = useState(false)
  const {medicationConfig, isMedicationConfigLoading, medicationConfigError} =
    useMedicationConfig()

  const {
    run: searchDrug,
    data: drugs,
    error: error,
  } = useAsync<DrugResult>({
    deferFn: () => search(userInput.trim()),
    // onReject: (e) => error ?? console.log(e),
  })

  useEffect(() => {
    if (userInput.length > 1) {
      searchDrug()
    }
    setIsUserInputAvailable(userInput.length >= 2)
    setAllowOnlyCodedDrug(false)
    setSelectedDrug(null)
  }, [userInput])

  const clearUserInput = () => {
    setUserInput('')
    setIsUserInputAvailable(false)
    setSelectedDrug(null)
  }

  const updateStatesForNonCodedDrug = () => {
    if (
      medicationConfig?.tabConfig?.allMedicationTabConfig?.inputOptionsConfig
        ?.allowOnlyCodedDrugs
    )
      setAllowOnlyCodedDrug(true)
    else {
      setSelectedDrug({name: userInput})
      setAllowOnlyCodedDrug(false)
    }
  }

  const showDrugOptions = () => {
    if (
      drugs &&
      drugs.results.length > 0 &&
      isUserInputAvailable &&
      !selectedDrug
    ) {
      return drugs.results.map((drug, i: number) => (
        <ClickableTile
          data-testid={`drugDataId ${i}`}
          key={drug.uuid}
          onClick={() => setSelectedDrug(drug)}
        >
          {drug.name}
        </ClickableTile>
      ))
    } else if (
      drugs &&
      drugs.results.length === 0 &&
      isUserInputAvailable &&
      !selectedDrug
    ) {
      return (
        <ClickableTile
          data-testid="nonCodedDrug"
          onClick={updateStatesForNonCodedDrug}
        >
          "{userInput}"
        </ClickableTile>
      )
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.search_bar}>
        <Search
          id="search"
          data-testid="Search Drug"
          labelText="SearchDrugs"
          placeholder="Search for drug to add in prescription"
          onChange={(e: {target: HTMLInputElement}) =>
            setUserInput(e.target.value)
          }
          onClear={() => clearUserInput()}
          value={userInput}
        />
        <div style={styles.tileList}>{showDrugOptions()}</div>
      </div>
      {allowOnlyCodedDrug && userInput && (
        <p style={{color: 'red'}}>
          This drug is not available in the system. Please select from the list
          of drugs available in the system{' '}
        </p>
      )}
      {selectedDrug && (
        <AddPrescriptionModal
          drug={selectedDrug}
          onClose={clearUserInput}
        ></AddPrescriptionModal>
      )}
      <PrescriptionWidget />
    </div>
  )
}

export default MedicationApp
