import { ClickableTile, Search, Tab, Tabs } from '@bahmni/design-system';
import React, { useEffect, useState } from 'react';
import { useAsync } from 'react-async';
import ActivePrescription from './ActivePrescription';
import { search } from './api';

const styles = {
  container: {
    width: '70%',
    margin: '1rem 0 0 1rem',
    position: 'absolute',
  } as React.CSSProperties,
  tileList: {
    margin: 'auto',
    overflow: 'scroll',
    maxHeight: '20rem',
  },
  tablePosition: { paddingTop: '10rem' } as React.CSSProperties,
};

const MedicationApp = () => {
  const [userInput, setUserInput] = useState('');
  const [isUserInputAvailable, setIsUserInputAvailable] = useState<Boolean>(false);
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
      <div style={styles.tablePosition}>
        <Tabs>
          <Tab label="Active Prescription">
            <ActivePrescription />
          </Tab>
          <Tab label="Schedule" />
          <Tab label="Show all" />
        </Tabs>
      </div>
    </div>
  );
};

export default MedicationApp;
