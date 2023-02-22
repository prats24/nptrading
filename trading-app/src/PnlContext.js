import React, { createContext, useState } from 'react';

export const NetPnlContext = createContext();

export const NetPnlProvider = ({ children }) => {
  const [netPnl, setNetPnl] = useState(0);
  const [totalRunningLots, setTotalRunningLots] = useState(0);

  const updateNetPnl = (value,runninglots) => {
    setNetPnl(value);
    setTotalRunningLots(runninglots);
  };

  return (
    <NetPnlContext.Provider value={{ netPnl,totalRunningLots, updateNetPnl }}>
      {children}
    </NetPnlContext.Provider>
  );
};
