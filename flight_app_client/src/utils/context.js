import React, { useState, createContext, useMemo } from 'react';

export const GlobalSearchStateContext = createContext();

const GlobalSearchStateContextProvider = (props) => {
  const [adventureMode, setAdventureMode] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [firstSearch, setFirstSearch] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('userToken')
  );

  const value = useMemo(
    () => ({
      adventureMode,
      setAdventureMode,
      searchDrawerOpen,
      setSearchDrawerOpen,
      firstSearch,
      setFirstSearch,
      isLoggedIn,
      setIsLoggedIn,
    }),
    [adventureMode, searchDrawerOpen, firstSearch, isLoggedIn]
  );
  return (
    <GlobalSearchStateContext.Provider value={value}>
      {props.children}
    </GlobalSearchStateContext.Provider>
  );
};

export default GlobalSearchStateContextProvider;
