import React, { useState, useContext, useEffect } from "react";

const Context = React.createContext();

export default Context;

export const useReddit = () => {
    return useContext(Context);
    };


export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

// check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Context.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
      {children}
    </Context.Provider>
  );
};
