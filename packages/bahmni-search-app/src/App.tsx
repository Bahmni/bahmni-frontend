import React, { useState, useEffect } from 'react';
import { Search } from './design-system';
import { search } from './api';
import { useAsync } from 'react-async';

const App = () => {
  const [textInput, setTextInput] = useState('');
  const [drugsArray, setDrugsArray] = useState([]);
  const {
    run: searchDrug,
    data: drugs,
    error: error,
  } = useAsync({
    deferFn: () => search(textInput),
    onReject: () => error ?? console.log('searchDrug Failed: Error fetching drug names'),
  });

  useEffect(() => {
    if (drugs) {
      setDrugsArray([]);
      drugs.results.map((drug) => {
        setDrugsArray([...drugsArray, drug.name]);
      });
    }
  }, [drugs]);

  useEffect(() => {
    if (textInput.length > 1) {
      searchDrug();
    }
  }, [textInput]);

  const handleTextInput = (e) => {
    setTextInput(e.target.value);
  };

  return (
    <div>
      <Search id="search" onChange={(e) => handleTextInput(e)} />
    </div>
  );
};

export default App;
