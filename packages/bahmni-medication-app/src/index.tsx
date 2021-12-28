import React, { useState, useEffect } from 'react';
import { Search, ClickableTile } from '@bahmni/design-system';
import { search } from './api';
import { useAsync } from 'react-async';
import PrescriptionDialog from './components/PrescriptionDialog';

const styles = {
  container: {
    margin: '1rem 0 0 1rem',
  },
  search_bar: {
    width: '70%',
  },
  tileList: {
    margin: 'auto',
    overflow: 'scroll',
    maxHeight: '20rem',
  },
};

const MedicationApp = () => {
  const [userInput, setUserInput] = useState<String>('');
  const [isUserInputAvailable, setIsUserInputAvailable] = useState<Boolean>(false);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const {
    run: searchDrug,
    data: drugs,
    error: error,
  } = useAsync({
    deferFn: () => search(userInput.trim()),
    // onReject: (e) => error ?? console.log(e),
  });

  useEffect(() => {
    if (userInput.length > 1) {
      searchDrug();
    }
    setIsUserInputAvailable(userInput.length >= 2);
    setSelectedDrug(false);
  }, [userInput]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

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

  const handlePrescriptionDialogClose = () => {
    setSelectedDrug(null);
    clearUserInput();
  };
  return (
    <div style={styles.container}>
      <div style={styles.search_bar}>
        <Search
          id="search"
          data-testid="Search Drug"
          labelText="SearchDrugs"
          placeholder="Search for drug to add in prescription"
          onChange={(e) => handleUserInput(e)}
          onClear={() => clearUserInput()}
          value={userInput}
        />
        <div style={styles.tileList}>{showDrugOptions()}</div>
      </div>
      {selectedDrug && (
        <PrescriptionDialog drug={selectedDrug} onClose={handlePrescriptionDialogClose}></PrescriptionDialog>
      )}
    </div>
  );
};

export default MedicationApp;
