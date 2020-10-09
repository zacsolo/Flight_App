import React, { useState, useContext } from 'react';
import {
  GET_CHEAPEST_ROUNDTRIP_WITH_DEST,
  GET_CHEAPEST_ONE_WAY_WITH_DEST,
} from '../gql/FlightQueries';
import { useLazyQuery } from '@apollo/client';
import { GlobalSearchStateContext } from '../utils/context';

import FlightForm from '../components/FlightForm';
import FlightDisplayCard from '../components/FlightDisplayCard';
import SearchDrawer from '../components/SearchDrawer';
import Hiker from '../media/Hiker_v1.png';

export default function ChooseDestinationFlight() {
  const { searchDrawerOpen, firstSearch, setFirstSearch } = useContext(
    GlobalSearchStateContext
  );
  const [oneWayOptions, setOneWayOptions] = useState([]);
  const [roundTripOptions, setRoundTripOptions] = useState([]);

  const [getRoundTripFlights, { data, loading, error }] = useLazyQuery(
    GET_CHEAPEST_ROUNDTRIP_WITH_DEST,
    {
      fetchPolicy: 'no-cache',
      onCompleted: (data) =>
        setRoundTripOptions(data.getFlightsWithDestRoundTrip),
    }
  );
  const [
    getOneWayFlights,
    { data: oneWayData, loading: oneWayLoading, error: oneWayError },
  ] = useLazyQuery(GET_CHEAPEST_ONE_WAY_WITH_DEST, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => setOneWayOptions(data.getFlightsWithDestOneWay),
  });
  console.log(firstSearch);
  const searchForFlights = (flightQuery) => {
    setFirstSearch(false);
    setOneWayOptions([]);
    setRoundTripOptions([]);
    if (flightQuery.inboundDate !== '') {
      getRoundTripFlights({
        variables: {
          startingAirport: flightQuery.startingAirport,
          endingAirport: flightQuery.endingAirport,
          outboundDate: flightQuery.outboundDate,
          inboundDate: flightQuery.inboundDate,
        },
      });
    } else {
      getOneWayFlights({
        variables: {
          startingAirport: flightQuery.startingAirport,
          endingAirport: flightQuery.endingAirport,
          outboundDate: flightQuery.outboundDate,
        },
      });
    }
  };

  return (
    <div className='App'>
      {firstSearch && (
        <>
          <FlightForm error={error} searchForFlights={searchForFlights} />
          <img src={Hiker} alt='travel image' style={{ width: '100%' }} />
        </>
      )}
      {!firstSearch && searchDrawerOpen ? (
        <SearchDrawer>
          <FlightForm error={error} searchForFlights={searchForFlights} />
        </SearchDrawer>
      ) : null}
      {data && !loading && (
        <>
          {roundTripOptions.map((f) => (
            <FlightDisplayCard key={f.id} flight={{ ...f }} />
          ))}
          {error && console.log(error)}
        </>
      )}
      {oneWayData && !oneWayLoading && (
        <>
          {oneWayOptions.map((f) => (
            <FlightDisplayCard key={f.id} flight={{ ...f }} />
          ))}
          {oneWayError && console.log(oneWayError)}
        </>
      )}
    </div>
  );
}
