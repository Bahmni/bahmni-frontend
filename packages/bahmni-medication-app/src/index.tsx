import { ClickableTile, Search, Tab, Tabs } from '@bahmni/design-system';
import React, { useEffect, useState } from 'react';
import { useAsync } from 'react-async';
import ActivePrescription from './ActivePrescription';
import { search } from './api';
import PrescriptionDialog from './components/PrescriptionDialog';
import { Drug, DrugResult } from './types';

const styles = {
  container: {
    margin: '1rem 0 0 1rem',
    position: 'absolute',
  } as React.CSSProperties,
  search_bar: {
    width: '70%',
  },
  tileList: {
    margin: 'auto',
    overflow: 'scroll',
    maxHeight: '20rem',
  },
  tablePosition: {
    paddingTop: '10rem',
  },
};

const MedicationApp = () => {
  const [userInput, setUserInput] = useState('');
  const [isUserInputAvailable, setIsUserInputAvailable] = useState<Boolean>(false);
  const [selectedDrug, setSelectedDrug] = useState<Drug>(null);
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
      <div style={styles.search_bar}>
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
      {selectedDrug && <PrescriptionDialog drug={selectedDrug} onClose={clearUserInput}></PrescriptionDialog>}
      <div style={styles.tablePosition}>
        <Tabs>
          <Tab label="Active Prescription">
            <ActivePrescription />
          </Tab>
          <Tab label="Scheduled Prescription" />
          <Tab label="Show all" />
        </Tabs>
      </div>
    </div>
  );
};

export default MedicationApp;
