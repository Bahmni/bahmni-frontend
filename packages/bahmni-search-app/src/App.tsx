import React, { useState, useEffect } from 'react';
import { TextInput } from './design-system';
import { search } from './api';

const App = () => {
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    if (textInput.length > 1) {
      search(textInput);
    }
  }, [textInput]);

  const handleTextInput = (e) => {
    setTextInput(e.target.value);
  };
  return (
    <>
      <h1>Hello Webpack React</h1>
      <TextInput id="search" labelText="Search_Drugs" onChange={(e) => handleTextInput(e)}></TextInput>
    </>
  );
};

export default App;
