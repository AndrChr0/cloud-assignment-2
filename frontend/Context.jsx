import React, { useState, useContext, useEffect } from "react";

const Context = React.createContext();

export default Context;

export const useReddit = () => {
    return useContext(Context);
};

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);  // Add this state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {

    if(!isLoggedIn){
      localStorage.removeItem("user");
      localStorage.removeItem("userID");
      return
    }


    const user = localStorage.getItem("user");
    const id = localStorage.getItem("userID");  // Retrieve userID from localStorage
    if (user) {
      setUser(user);
      setUserID(id);  // Set userID
      setIsLoggedIn(true);
    }
  }, []);

  return (
    // Global variables for user, userID, and login status
    <Context.Provider value={{ user, setUser, userID, isLoggedIn, setIsLoggedIn }}>
      {children}
    </Context.Provider>
  );
};
