import React, { useState } from 'react'

export const userContext = React.createContext();

export default function AuthContext({children}) {
    const [userDetails, setUserDetail] = useState({});
    
  return (
      <userContext.Provider value={{userDetails, setUserDetail}}>
        {children}
      </userContext.Provider>
  )
}