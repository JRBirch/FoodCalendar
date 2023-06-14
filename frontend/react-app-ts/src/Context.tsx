import { createContext, useContext } from "react";

import useLocalStorage from "./custom_hooks/useLocalStorage";

type GlobalContext = {
  isLoggedIn: boolean;
  setIsLoggedIn: (newValue: boolean) => void;
  setAndClearIsLoggedIn: (newValue: boolean) => void;
  username: string;
  setUsername: (newValue: string) => void;
  setAndClearUsername: (newValue: string) => void;
};

const initialGlobalContext: GlobalContext = {
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  setAndClearIsLoggedIn: () => {},
  username: "",
  setUsername: () => {},
  setAndClearUsername: () => {},
};

const AppContext = createContext<GlobalContext>(initialGlobalContext);

const AppProvider = ({ children }: { children: any }) => {
  const {
    value: isLoggedIn,
    setValueAndLocalStorage: setIsLoggedIn,
    setValueAndClearLocalStorage: setAndClearIsLoggedIn,
  } = useLocalStorage<boolean>(initialGlobalContext.isLoggedIn, "isLoggedIn");
  const {
    value: username,
    setValueAndLocalStorage: setUsername,
    setValueAndClearLocalStorage: setAndClearUsername,
  } = useLocalStorage<string>(initialGlobalContext.username, "username");

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, setAndClearIsLoggedIn, username, setUsername, setAndClearUsername }}>
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { useGlobalContext, AppProvider };
