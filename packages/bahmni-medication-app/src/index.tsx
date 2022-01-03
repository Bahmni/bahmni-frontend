import React, { useState, useEffect } from 'react';
import { Search, ClickableTile, Button, Add20 } from '@bahmni/design-system';
import { search } from './api';
import { useAsync } from 'react-async';
import PrescriptionDialog from './components/PrescriptionDialog';
import { Drug, DrugResult, DrugName } from './types';

const styles = {
  container: {
    margin: '1rem 0 0 1rem',
  },
  searchComponent: {
    display: 'flex',
  },
  tileList: {
    margin: 'auto',
    overflow: 'scroll',
    maxHeight: '20rem',
  },
  searchBar: {
    width: '70%',
  },
  button: {
    marginLeft: '0.5rem',
    height: '20%',
  },
  addIcon: { verticalAlign: 'sub' },
};

const MedicationApp = () => {
  const [userInput, setUserInput] = useState<String>('');
  const [isUserInputAvailable, setIsUserInputAvailable] = useState<Boolean>(false);
  const [selectedDrug, setSelectedDrug] = useState<Drug | DrugName>(null);
  const {
    run: searchDrug,
    data: drugs,
    error: error,
  } = useAsync<DrugResult>({
    deferFn: () => search(userInput.trim()),
    // onReject: (e) => error ?? console.log(e),
  });

  useEffect(() => {
    if (userInput.length > 1) {
      searchDrug();
    }
    setIsUserInputAvailable(userInput.length >= 2);
    setSelectedDrug(null);
  }, [userInput]);

  const clearUserInput = () => {
    setUserInput('');
    setIsUserInputAvailable(false);
    setSelectedDrug(null);
  };

  const showDrugOptions = () => {
    if (drugs && isUserInputAvailable && !selectedDrug) {
      return drugs.results.map((drug, i: number) => (
        <ClickableTile data-testid={`drugDataId ${i}`} key={drug.uuid} onClick={() => setSelectedDrug(drug)}>
          {drug.name}
        </ClickableTile>
      ));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchComponent}>
        <div style={styles.searchBar}>
          <Search
            id="search"
            data-testid="Search Drug"
            labelText="SearchDrugs"
            placeholder="Search for drug to add in prescription"
            onChange={(e: { target: HTMLInputElement }) => setUserInput(e.target.value)}
            onClear={() => clearUserInput()}
            value={userInput}
          />
          <div style={styles.tileList}>{showDrugOptions()}</div>
        </div>
        <Button
          className="confirm"
          disabled={userInput.length < 1 || !!selectedDrug}
          style={styles.button}
          onClick={() => setSelectedDrug({ name: userInput })}
          title="Add Prescription">
          {' '}
          <Add20 aria-label="Add" style={styles.addIcon} />
          Add To Prescription
        </Button>
      </div>
      {selectedDrug && <PrescriptionDialog drug={selectedDrug} onClose={clearUserInput}></PrescriptionDialog>}
    </div>
  );
};

export default MedicationApp;
