import React, { useState, useContext } from 'react';
import { GlobalSearchStateContext } from '../utils/context';

import {
  GET_ONE_WAY_FLIGHT_ANYWHERE,
  GET_ROUND_TRIP_FLIGHT_ANYWHERE,
} from '../gql/FlightQueries';
import { useLazyQuery } from '@apollo/client';

import FlightForm from '../components/FlightForm';
import FlightDisplayCard from '../components/FlightDisplayCard';
import SearchDrawer from '../components/SearchDrawer';
import Hiker from '../media/Hiker_v1.png';

export default function AnywhereFlight() {
  const { searchDrawerOpen, firstSearch, setFirstSearch } = useContext(
    GlobalSearchStateContext
  );

  const [oneWayOptions, setOneWayOptions] = useState([]);
  const [roundTripOptions, setRoundTripOptions] = useState([]);

  const [oneWayToAnywhereQuery, { data, loading, error }] = useLazyQuery(
    GET_ONE_WAY_FLIGHT_ANYWHERE,
    {
      fetchPolicy: 'no-cache',
      onCompleted: (data) => setOneWayOptions(data.cheapestFlightsToAnywhere),
    }
  );
  const [
    roundTripToAnywhereQuery,
    { data: roundTripData, loading: roundTripLoading, error: roundTripError },
  ] = useLazyQuery(GET_ROUND_TRIP_FLIGHT_ANYWHERE, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => setRoundTripOptions(data.roundTripFlightToAnywhere),
  });

  const searchForFlights = ({
    inboundDate,
    startingAirport,
    outboundDate,
    oneWay,
  }) => {
    setFirstSearch(false);
    setOneWayOptions([]);
    setRoundTripOptions([]);
    if (inboundDate) {
      roundTripToAnywhereQuery({
        variables: {
          startingAirport: startingAirport,
          outboundDate: outboundDate,
          inboundDate: inboundDate,
        },
      });
    } else {
      oneWayToAnywhereQuery({
        variables: {
          startingAirport: startingAirport,
          searchDate: outboundDate,
          amountOfResults: 50,
        },
      });
    }
  };

  if (error) {
    console.log(error);
  }
  if (roundTripError) {
    console.log(roundTripError);
  }
  return (
    <div className='App'>
      {firstSearch && (
        <>
          <FlightForm
            error={error ? error : roundTripError ? roundTripError : null}
            searchForFlights={searchForFlights}
            noDestinationPicker={true}
          />
          <img src={Hiker} alt='travel' style={{ width: '100%' }} />
        </>
      )}
      {!firstSearch && searchDrawerOpen ? (
        <SearchDrawer>
          <FlightForm
            error={error ? error : roundTripError ? roundTripError : null}
            searchForFlights={searchForFlights}
            noDestinationPicker={true}
          />
        </SearchDrawer>
      ) : null}
      {data && !loading && (
        <div>
          {oneWayOptions.map((f) => (
            <FlightDisplayCard key={f.id} flight={{ ...f }} />
          ))}
        </div>
      )}
      {roundTripData && !roundTripLoading && (
        <div>
          {roundTripOptions.map((f) => (
            <FlightDisplayCard key={f.id} flight={{ ...f }} />
          ))}
        </div>
      )}
    </div>
  );
}
