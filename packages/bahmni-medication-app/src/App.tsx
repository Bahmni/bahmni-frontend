import React, { useState, useEffect } from 'react';
import { Search, ClickableTile } from './design-system';
import { search } from './api';
import { useAsync } from 'react-async';

const styles = {
  container: {
    width: '50%',
    padding: '10rem',
    margin: 'auto',
  },
  tileList: {
    margin: 'auto',
    overflow: 'scroll',
    maxHeight: '20rem',
  },
};

const App = () => {
  const [textInput, setTextInput] = useState('');
  const [isTextInputAvailable, setIsTextInputAvailable] = useState(false);
  const {
    run: searchDrug,
    data: drugs,
    error: error,
  } = useAsync({
    deferFn: () => search(textInput),
    onReject: (e) => error ?? console.log(e),
  });

  useEffect(() => {
    if (textInput.length > 1 && textInput.length < 17) {
      searchDrug();
    }
    textInput.length == 2 ? setIsTextInputAvailable(true) : setIsTextInputAvailable(!(textInput.length < 2));
  }, [textInput]);

  const handleTextInput = (e) => {
    setTextInput(e.target.value);
  };

  const clearTextInput = () => {
    setTextInput('');
    setIsTextInputAvailable(false);
  };

  const selectDrug = (e) => {
    console.log(e.target.outerText);
    setTextInput(e.target.outerText);
  };

  const renderClickableTile = () => {
    if (drugs && isTextInputAvailable) {
      return drugs.results.map((drug) => (
        <ClickableTile key={drug.uuid} onClick={(e) => selectDrug(e)}>
          {drug.name}
        </ClickableTile>
      ));
    }
  };

  return (
    <div style={styles.container}>
      <Search
        id="search"
        data-testid="Search Drug"
        labelText="SearchDrugs"
        onChange={(e) => handleTextInput(e)}
        onClear={() => clearTextInput()}
        value={textInput}
      />
      <div style={styles.tileList}>{renderClickableTile()}</div>
    </div>
  );
};

export default App;
