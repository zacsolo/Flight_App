import { gql } from '@apollo/client';

const GET_CHEAPEST_ROUNDTRIP_WITH_DEST = gql`
  query getFlightsWithDestRoundTrip(
    $startingAirport: String!
    $endingAirport: String!
    $outboundDate: String!
    $inboundDate: String!
  ) {
    getFlightsWithDestRoundTrip(
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
      cityName
      outboundOrigin
      outboundDestination
      inboundOrigin
      inboundDestination
    }
  }
`;

const GET_CHEAPEST_ONE_WAY_WITH_DEST = gql`
  query querygetFlightsWithDestOneWay(
    $startingAirport: String!
    $endingAirport: String!
    $outboundDate: String!
  ) {
    getFlightsWithDestOneWay(
      startingAirport: $startingAirport
      endingAirport: $endingAirport
      outboundDate: $outboundDate
    ) {
      price
      direct
      departureDate
      outboundCarrierName
      returnDate
      inboundCarrierName
      id
      cityName
      outboundOrigin
      outboundDestination
      inboundOrigin
      inboundDestination
    }
  }
`;

const GET_ONE_WAY_FLIGHT_ANYWHERE = gql`
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

const GET_ROUND_TRIP_FLIGHT_ANYWHERE = gql`
  query roundTripFlightToAnywhere(
    $startingAirport: String!
    $outboundDate: String!
    $inboundDate: String!
  ) {
    roundTripFlightToAnywhere(
      startingAirport: $startingAirport
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
      cityName
      outboundOrigin
      outboundDestination
      inboundOrigin
      inboundDestination
    }
  }
`;

export {
  GET_CHEAPEST_ROUNDTRIP_WITH_DEST,
  GET_CHEAPEST_ONE_WAY_WITH_DEST,
  GET_ONE_WAY_FLIGHT_ANYWHERE,
  GET_ROUND_TRIP_FLIGHT_ANYWHERE,
};
