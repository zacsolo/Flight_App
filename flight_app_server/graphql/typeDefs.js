const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    getCheapestFlightsForQuery(
      startingAirport: String!
      endingAirport: String!
      outboundDate: String!
      inboundDate: String
    ): [Flight]
    findAirport(airportSearch: String!): [Place]
    cheapestFlightsToAnywhere(
      startingAirport: String!
      searchDate: String!
      amountOfResults: Int
    ): [ExtendedFlightInfo]
    roundTripFlightToAnywhere(
      startingAirport: String!
      outboundDate: String!
      inboundDate: String
    ): [Flight]
  }
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    passwordHash: String!
    createdAt: String!
    token: String!
  }
  type Flight {
    price: Int!
    direct: Boolean!
    departureDate: String!
    outboundCarrierName: String!
    id: String!

    returnDate: String
    inboundCarrierName: String
    outboundOrigin: String!
    outboundDestination: String!
    inboundOrigin: String
    inboundDestination: String
  }
  type ExtendedFlightInfo {
    price: Int!
    direct: Boolean!
    departureDate: String!
    outboundCarrierName: String
    outboundOrigin: String!
    outboundDestination: String!
    id: String!

    placeId: Int
    placeName: String
    cityName: String
    countryName: String!
    IataCode: String
  }
  type Place {
    placeId: String!
    placeName: String!
    regionId: String
    cityId: String
    countryId: String
    countryName: String
  }

  type Mutation {
    signup(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User
    login(email: String!, password: String!): User
  }
`;

module.exports = typeDefs;
