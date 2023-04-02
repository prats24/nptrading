import React, { useState } from 'react'

export const marketDataContext = React.createContext();

export default function MarketDataContext({children}) {
    const [marketData, setMarketData] = useState([]);
    const [indexLiveData, setIndexLiveData] = useState([]);
  
  
  return (
      <marketDataContext.Provider value={{marketData, setMarketData, indexLiveData, setIndexLiveData}}>
        {children}
      </marketDataContext.Provider>
  )
}