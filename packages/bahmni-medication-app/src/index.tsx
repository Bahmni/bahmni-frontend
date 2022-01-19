import {ClickableTile, InlineLoading, Search} from '@bahmni/design-system'
import React, {useEffect, useState} from 'react'
import {useAsync} from 'react-async'
import AddPrescriptionModal from './AddPrescriptionModal/AddPrescriptionModal'
import useMedicationConfig from './hooks/useMedicationConfig'
import {PrescriptionWidget} from './PrescriptionsWidget/PrescriptionWidget'
import {search} from './services/drugs'
import {Drug, DrugResult, NewPrescription, NonCodedDrug} from './types'
import {addNewPrescription} from './NewPrescriptionTable/addNewPrescription'
import NewPrescriptionTable from './NewPrescriptionTable/NewPrescriptionTable'

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
  const [newPrescription, setNewPrescription] = useState<NewPrescription[]>([])
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
    setAllowOnlyCodedDrug(false)
    setSelectedDrug(null)
  }, [userInput])

  const updateStatesForNonCodedDrug = () => {
    // TODO: Refactor to get allowOnlyCodedDrugs based on tabConfigName
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

  const getErrorMessage = () => {
    return (
      <p style={{color: 'red'}}>
        This drug is not available in the system. Please select from the list of
        drugs available in the system{' '}
      </p>
    )
  }
  const handlePrescription = (data) => {
    setUserInput('');
    setNewPrescription([...newPrescription, addNewPrescription(data)]);
  }
  const showDrugOptions = () => {
    if (drugs.results.length === 0) {
      return allowOnlyCodedDrug ? (
        getErrorMessage()
      ) : (
        <ClickableTile
          data-testid="nonCodedDrug"
          onClick={updateStatesForNonCodedDrug}
        >
          "{userInput}"
        </ClickableTile>
      )
    }

    return drugs.results.map((drug, i: number) => (
      <ClickableTile
        data-testid={`drugDataId ${i}`}
        key={drug.uuid}
        onClick={() => setSelectedDrug(drug)}
      >
        {drug.name}
      </ClickableTile>
    ))
  }

  if (medicationConfigError)
    return <p>{`something went wrong ${medicationConfigError.message}`}</p>
  if (isMedicationConfigLoading)
    return <InlineLoading description="Loading Data..." />
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
          onClear={() => setUserInput('')}
          value={userInput}
        />
        {drugs && !selectedDrug && userInput.length >= 2 && (
          <div style={styles.tileList}>{showDrugOptions()}</div>
        )}
      </div>
      {selectedDrug && (
        <AddPrescriptionModal
          drug={selectedDrug}
          onClose={() => setUserInput('')}
          onDone={data => {
            handlePrescription(data)
          }}
        ></AddPrescriptionModal>
      )}
      <NewPrescriptionTable data={newPrescription}></NewPrescriptionTable>
      <PrescriptionWidget />
    </div>
  )
}

export default MedicationApp
