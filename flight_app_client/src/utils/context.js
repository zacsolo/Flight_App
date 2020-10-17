import React, { useState, createContext, useMemo } from 'react';

export const GlobalSearchStateContext = createContext();

const GlobalSearchStateContextProvider = (props) => {
  const [adventureMode, setAdventureMode] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [firstSearch, setFirstSearch] = useState(true);
  const [checkedSavedFlights, setCheckedSavedFlights] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
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
      //After a user saves a flight, this is set to false,
      //unitl they check it, by visiting their profile
      checkedSavedFlights,
      setCheckedSavedFlights,
      loginModalOpen,
      setLoginModalOpen,
    }),
    [
      adventureMode,
      searchDrawerOpen,
      firstSearch,
      isLoggedIn,
      checkedSavedFlights,
      loginModalOpen,
    ]
  );
  return (
    <GlobalSearchStateContext.Provider value={value}>
      {props.children}
    </GlobalSearchStateContext.Provider>
  );
};

export default GlobalSearchStateContextProvider;
