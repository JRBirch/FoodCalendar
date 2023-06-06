import { createContext, useContext, useState } from "react";

const AppContext = createContext({});

const AppProvider = ({ children }: { children: any }) => {
  const [username, setUsername] = useState<string>("");
  return <AppContext.Provider value={{ username, setUsername }}>{children}</AppContext.Provider>;
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { useGlobalContext, AppProvider };
