import { useState } from "react";

const useLocalStorage = <T,>(defaultValue: T, localStorageName: string) => {
  const localStorageValue = localStorage.getItem(localStorageName);
  if (localStorageValue) {
    defaultValue = JSON.parse(localStorageValue);
  }
  const [value, setValue] = useState<T>(defaultValue);

  const setValueAndLocalStorage = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(localStorageName, JSON.stringify(newValue));
  };

  const setValueAndClearLocalStorage = (newValue: T) => {
    setValue(newValue);
    localStorage.removeItem(localStorageName);
  };

  return { value, setValueAndLocalStorage, setValueAndClearLocalStorage };
};

export default useLocalStorage;