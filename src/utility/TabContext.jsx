// TabContext.js
import React, { createContext, useContext, useState } from "react";

const TabContext = createContext();

export const useTabContext = () => useContext(TabContext);

export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("1");

  const setTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <TabContext.Provider value={{ activeTab, setTab }}>
      {children}
    </TabContext.Provider>
  );
};
