import { gql } from '@apollo/client';

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
      outboundOrigin
      outboundDestination
      inboundOrigin
      inboundDestination
    }
  }
`;

const GET_FLIGHT_ANYWHERE = gql`
  query cheapestFlightsToAnywhere(
    $startingAirport: String!
    $searchDate: String!
    $amountOfResults: Int
  ) {
    cheapestFlightsToAnywhere(
      startingAirport: $startingAirport
      searchDate: $searchDate
      amountOfResults: $amountOfResults
    ) {
      price
      direct
      departureDate
      placeId
      placeName
      cityName
      countryName
      IataCode
      outboundCarrierName
      outboundOrigin
      outboundDestination
      id
    }
  }
`;

export { GET_CHEAP_FLIGHTS, GET_FLIGHT_ANYWHERE };
