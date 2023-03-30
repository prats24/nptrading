import React, { useState } from 'react'

export const marketDataContext = React.createContext();

export default function MarketDataContext({children}) {
    const [marketData, setMarketData] = useState([]);
  
  
  return (
      <marketDataContext.Provider value={{marketData, setMarketData}}>
        {children}
      </marketDataContext.Provider>
  )
}