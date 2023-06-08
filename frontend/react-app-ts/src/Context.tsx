import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

type GlobalContext = {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
};

const initialGlobalContext: GlobalContext = {
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  username: "",
  setUsername: () => {},
};

const AppContext = createContext<GlobalContext>(initialGlobalContext);

const AppProvider = ({ children }: { children: any }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initialGlobalContext.isLoggedIn);
  const [username, setUsername] = useState<string>(initialGlobalContext.username);
  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, username, setUsername }}>
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { useGlobalContext, AppProvider };
