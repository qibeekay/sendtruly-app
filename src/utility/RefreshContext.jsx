import React, { createContext, useState } from "react";

// Create the context
export const RefreshContext = createContext();

// Create a provider component
export const RefreshProvider = ({ children }) => {
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Function to trigger a refresh
  const triggerRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  return (
    <RefreshContext.Provider value={{ refreshCounter, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};
