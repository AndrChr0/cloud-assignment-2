import React, { useState, useContext } from "react";

const Context = React.createContext();

export default Context;

export const useReddit = () => {
    return useContext(Context);
    };


export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Context.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
      {children}
    </Context.Provider>
  );
};
