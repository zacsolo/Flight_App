import React, { useState } from 'react';

import {
  GET_ONE_WAY_FLIGHT_ANYWHERE,
  GET_ROUND_TRIP_FLIGHT_ANYWHERE,
} from '../gql/FlightQueries';
import { useLazyQuery } from '@apollo/client';

import FlightForm from '../components/FlightForm';
import FlightDisplayCard from '../components/FlightDisplayCard';
import SearchDrawer from '../components/SearchDrawer';

export default function AnywhereFlight() {
  const [oneWayOptions, setOneWayOptions] = useState([]);
  const [initialSearch, setInitialSearch] = useState(true);
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
    setInitialSearch(false);
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
      {initialSearch ? (
        <FlightForm
          error={error ? error : roundTripError ? roundTripError : null}
          searchForFlights={searchForFlights}
          noDestinationPicker={true}
        />
      ) : (
        <SearchDrawer>
          <FlightForm
            error={error ? error : roundTripError ? roundTripError : null}
            searchForFlights={searchForFlights}
            noDestinationPicker={true}
          />
        </SearchDrawer>
      )}

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
