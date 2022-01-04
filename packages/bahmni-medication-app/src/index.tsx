import React, { useState, useEffect } from 'react';
import { Search, ClickableTile, InlineLoading, InlineNotification } from '@bahmni/design-system';
import { fetchDrugOrderConfig, search } from './api';
import { useAsync } from 'react-async';
import PrescriptionDialog from './components/PrescriptionDialog';
import { Drug, DrugOrderConfig, DrugResult } from './types';

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
  const [selectedDrug, setSelectedDrug] = useState<Drug>(null);
  const {
    run: searchDrug,
    data: drugs,
    error: error,
  } = useAsync<DrugResult>({
    deferFn: () => search(userInput.trim()),
    // onReject: (e) => error ?? console.log(e),
  });
  const {
    run: getDrugOrderConfig,
    data: drugOrderConfig,
    error: drugOrderConfigError,
    status: isDrugOrderConfigLoaded,
  } = useAsync<DrugOrderConfig>({
    deferFn: () => fetchDrugOrderConfig(),
    // onReject: (e) => error ?? console.log(e),
  });

  useEffect(() => {
    getDrugOrderConfig();
  }, []);

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

  const renderPrescriptionDialog = () => {
    switch (isDrugOrderConfigLoaded) {
      case 'pending':
        return <InlineLoading description="Loading Data..."></InlineLoading>;
      case 'rejected':
        return <InlineNotification kind="error" title="Something went wrong"></InlineNotification>;
      case 'fulfilled':
        return (
          <PrescriptionDialog
            drug={selectedDrug}
            onClose={clearUserInput}
            drugOrderConfig={drugOrderConfig}></PrescriptionDialog>
        );
      default:
        break;
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
      {selectedDrug && renderPrescriptionDialog()}
    </div>
  );
};

export default MedicationApp;
