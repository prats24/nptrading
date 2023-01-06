import React, { useState } from 'react'

export const userContext = React.createContext();

export default function AuthContext({children}) {
    const [userDetails, setUserDetail] = useState({});
    const [marketData, setMarketData] = useState([]);
    const [tradeData, setTradeData] = useState([]);
    
  return (
      <userContext.Provider value={{userDetails, setUserDetail, marketData, setMarketData, tradeData, setTradeData}}>
        {children}
      </userContext.Provider>
  )
}