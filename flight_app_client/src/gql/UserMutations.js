import { gql } from '@apollo/client';

export const SIGN_UP = gql`
  mutation signup(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      firstName
      lastName
      email
      passwordHash
      createdAt
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      firstName
      lastName
      email
      passwordHash
      createdAt
      token
    }
  }
`;

export const SAVE_FLIGHT_TO_USER = gql`
  mutation saveUserFlight(
    $price: Int!
    $direct: Boolean!
    $departureDate: String!
    $outboundCarrierName: String!
    $cityName: String!
    $returnDate: String
    $inboundCarrierName: String
    $outboundOrigin: String!
    $outboundDestination: String!
    $inboundOrigin: String
    $inboundDestination: String
  ) {
    saveUserFlight(
      price: $price
      direct: $direct
      departureDate: $departureDate
      outboundOrigin: $outboundOrigin
      outboundDestination: $outboundDestination
      returnDate: $returnDate
      inboundOrigin: $inboundOrigin
      inboundDestination: $inboundDestination
      outboundCarrierName: $outboundCarrierName
      inboundCarrierName: $inboundCarrierName
      cityName: $cityName
    ) {
      id
      firstName
      lastName
      email
      passwordHash
      createdAt
      savedFlights {
        price
        direct
        departureDate
        outboundCarrierName
        cityName
        returnDate
        inboundCarrierName
        outboundOrigin
        outboundDestination
        inboundOrigin
        inboundDestination
      }
      token
    }
  }
`;

export const REMOVE_FLIGHT_FROM_USER = gql`
  mutation removeUserFlight(
    $departureDate: String!
    $outboundOrigin: String!
    $outboundDestination: String!
  ) {
    removeUserFlight(
      departureDate: $departureDate
      outboundOrigin: $outboundOrigin
      outboundDestination: $outboundDestination
    ) {
      id
      firstName
      lastName
      email
      passwordHash
      createdAt
      savedFlights {
        price
        direct
        departureDate
        outboundCarrierName
        cityName
        returnDate
        inboundCarrierName
        outboundOrigin
        outboundDestination
        inboundOrigin
        inboundDestination
      }
      token
    }
  }
`;

export const GET_USER = gql`
  query getUser {
    getUser {
      id
      firstName
      lastName
      email
      passwordHash
      createdAt
      token
      savedFlights {
        price
        direct
        departureDate
        outboundCarrierName
        cityName
        returnDate
        inboundCarrierName
        outboundOrigin
        outboundDestination
        inboundOrigin
        inboundDestination
      }
    }
  }
`;
