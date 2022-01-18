import {ClickableTile, Search} from '@bahmni/design-system'
import React, {useEffect, useState} from 'react'
import {useAsync} from 'react-async'
import AddPrescriptionModal from './AddPrescriptionModal/AddPrescriptionModal'
import {PrescriptionWidget} from './PrescriptionsWidget/PrescriptionWidget'
import {search} from './services/drugs'
import {Drug, DrugResult, NewPrescription} from './types'
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
  const [isUserInputAvailable, setIsUserInputAvailable] =
    useState<Boolean>(false)
  const [selectedDrug, setSelectedDrug] = useState<Drug>(null)
  const [newPrescription, setNewPrescription] = useState<NewPrescription[]>([])
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
    setSelectedDrug(null)
  }, [userInput])

  const clearUserInput = () => {
    setUserInput('')
    setIsUserInputAvailable(false)
    setSelectedDrug(null)
  }
  const handlePrescription = (data) => {
    setUserInput('');
    setNewPrescription([...newPrescription, addNewPrescription(data)]);
  }
  const showDrugOptions = () => {
    if (drugs && isUserInputAvailable && !selectedDrug) {
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
      {selectedDrug && (
        <AddPrescriptionModal
          drug={selectedDrug}
          onClose={clearUserInput}
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
