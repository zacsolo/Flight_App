import React, { useContext } from 'react';
import NavBar from '../components/NavBar';
import { GlobalSearchStateContext } from '../utils/context';

import AnywhereFlight from './AnywhereFlight';
import ChooseDestinationFlight from './ChooseDestinationFlight';

export default function Home() {
  const { adventureMode } = useContext(GlobalSearchStateContext);

  return (
    <>
      <div className='App'>
        {adventureMode ? <AnywhereFlight /> : <ChooseDestinationFlight />}
      </div>
    </>
  );
}

//Home is the only component rendered by APP
//Contains static navbar and a variable form
