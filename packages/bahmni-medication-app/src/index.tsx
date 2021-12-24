import React, { useState, useEffect } from 'react';
import { Search, ClickableTile } from '@bahmni/design-system';
import { search, getActivePrescription } from './api';
import { useAsync } from 'react-async';
import ActivePrescription from './ActivePrescription';

const styles = {
  container: {
    width: '70%',
    margin: '1rem 0 0 1rem',
  },
  tileList: {
    margin: 'auto',
    overflow: 'scroll',
    maxHeight: '20rem',
  },
};

const MedicationApp = () => {
  const url = window.location.hash;
  const urlArray = url.split('/');
  const patientUuid = urlArray[urlArray.indexOf('patient') + 1];
  const [userInput, setUserInput] = useState<String>('');
  const [isUserInputAvailable, setIsUserInputAvailable] = useState<Boolean>(false);
  const {
    run: searchDrug,
    data: drugs,
    error: error,
  } = useAsync({
    deferFn: () => search(userInput.trim()),
    // onReject: (e) => error ?? console.log(e),
  });
  const {
    run: runActivePrescription,
    data: activePrescription,
    error: activePrescriptionError,
  } = useAsync({
    deferFn: () => getActivePrescription(patientUuid),
    //onReject: (e) => activePrescriptionError ?? console.log(e),
  });
  useEffect(() => {
    runActivePrescription();
  }, []);

  useEffect(() => {
    if (userInput.length > 1) {
      searchDrug();
    }
    userInput.length === 2 ? setIsUserInputAvailable(true) : setIsUserInputAvailable(!(userInput.length < 2));
  }, [userInput]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const clearUserInput = () => {
    setUserInput('');
    setIsUserInputAvailable(false);
  };

  const selectDrug = (e) => {
    setUserInput(e.target.outerText);
  };

  const showDrugOptions = () => {
    if (drugs && isUserInputAvailable) {
      return drugs.results.map((drug, i: number) => (
        <ClickableTile data-testid={`drugDataId ${i}`} key={drug.uuid} onClick={(e) => selectDrug(e)}>
          {drug.name}
        </ClickableTile>
      ));
    }
  };

  return (
    <div>
      <div style={styles.container}>
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
      {activePrescription && <ActivePrescription activePrescriptionData={activePrescription}></ActivePrescription>}
    </div>
  );
};

export default MedicationApp;
