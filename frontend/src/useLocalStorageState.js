import { useState } from "react";

//Custom hook: stores the value of an item in a variable while constantly writing it to localStorage whenever it's updated.
const useLocalStorageState = (initialValue, key) => {
  const [locallyStoredVariable, setLocallyStoredVariable] = useState(
    localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : initialValue
  );
  const setVariableAndStorage = (newValue) => {
    setLocallyStoredVariable(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };
  return [locallyStoredVariable, setVariableAndStorage];
};

export default useLocalStorageState;
