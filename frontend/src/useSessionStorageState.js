import { useState } from "react";

//Custom hook: stores the value of an item in a variable while constantly writing it to sessionStorage whenever it's updated.
const useSessionStorageState = (initialValue, key) => {
  const [sessionStoredVariable, setSessionStoredVariable] = useState(
    sessionStorage.getItem(key)
      ? JSON.parse(sessionStorage.getItem(key))
      : initialValue
  );
  const setVariableAndStorage = (newValue) => {
    setSessionStoredVariable(newValue);
    sessionStorage.setItem(key, JSON.stringify(newValue));
  };
  return [sessionStoredVariable, setVariableAndStorage];
};

export default useSessionStorageState;
