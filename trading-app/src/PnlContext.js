import React, { createContext, useState } from 'react';

export const NetPnlContext = createContext();

export const NetPnlProvider = ({ children }) => {
  const [netPnl, setNetPnl] = useState(0);

  const updateNetPnl = (value) => {
    setNetPnl(value);
  };

  return (
    <NetPnlContext.Provider value={{ netPnl, updateNetPnl }}>
      {children}
    </NetPnlContext.Provider>
  );
};
