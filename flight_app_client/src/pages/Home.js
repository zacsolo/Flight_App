import React, { useState } from 'react';
import { useLazyQuery, gql, useQuery } from '@apollo/client';
import QueryInput from '../components/QueryInput';
import BasicDatePicker from '../components/DatePicker';
import moment from 'moment';

export default function Home() {
  const [value, setValue] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
  });
  const [getFlights, { data, loading, error }] = useLazyQuery(
    GET_CHEAP_FLIGHTS
  );

  if (error) {
    console.log('ERROR', error.graphQLErrors[0].extensions.errors);
  }

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };
  const updateState = (inputPlace, name) => {
    console.log(inputPlace[0].placeId);
    const newPlace = inputPlace[0].placeId;
    setValue({ ...value, [name]: newPlace });
  };
  const updateDate = (inputDate, name) => {
    setValue({ ...value, [name]: inputDate });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(value);
    getFlights({
      variables: {
        startingAirport: value.from,
        endingAirport: value.to,
        outboundDate: value.departureDate,
        inboundDate: value.returnDate,
      },
    });
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className='App'>
      <form onSubmit={handleSubmit}>
        <QueryInput name='from' updateState={updateState} />
        <QueryInput name='to' updateState={updateState} />
        {/* <input placeholder='From' name='from' onChange={handleChange} /> */}
        <BasicDatePicker name='departureDate' updateDate={updateDate} />
        <BasicDatePicker name='returnDate' updateDate={updateDate} />
        {/* <input
          placeholder='Departure Date'
          name='departureDate'
          onChange={handleChange}
        /> */}
        {/* <input
          placeholder='Return Date'
          name='returnDate'
          onChange={handleChange}
        /> */}
        <button type='submit'>Search</button>
      </form>
      {data && (
        <div>
          {data.getCheapestFlightsForQuery.map((flight) => (
            <div
              key={flight.id}
              style={{ border: '3px solid blue', marginBottom: '5px' }}>
              <div style={{ border: '1px solid red' }}>
                <p>Price:{flight.price}</p>
                <p>Direct: {flight.direct ? 'Yes' : 'No'}</p>
              </div>
              <div style={{ border: '1px solid red' }}>
                <p>
                  Departure Date:{' '}
                  {moment(flight.departureDate).format('dddd, MMMM Do YYYY')}
                </p>
                <p> Carrier Name: {flight.outboundCarrierName}</p>
              </div>
              {flight.returnDate && (
                <div style={{ border: '1px solid red' }}>
                  <p>
                    Return Date:{' '}
                    {moment(flight.returnDate).format('dddd, MMMM Do YYYY')}
                  </p>
                  <p>Carrier Name: {flight.inboundCarrierName}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {error && (
        <ul>
          {Object.values(error.graphQLErrors[0].extensions.errors).map(
            (err) => (
              <li key={Math.random()}>{err}</li>
            )
          )}
        </ul>
      )}
    </div>
  );
}

const GET_CHEAP_FLIGHTS = gql`
  query getCheapestFlightsForQuery(
    $startingAirport: String!
    $endingAirport: String!
    $outboundDate: String!
    $inboundDate: String
  ) {
    getCheapestFlightsForQuery(
      startingAirport: $startingAirport
      endingAirport: $endingAirport
      outboundDate: $outboundDate
      inboundDate: $inboundDate
    ) {
      price
      direct
      departureDate
      outboundCarrierName
      returnDate
      inboundCarrierName
      id
    }
  }
`;
