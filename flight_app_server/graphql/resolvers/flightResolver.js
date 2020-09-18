const { UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const BASE_URL =
  'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0';
const USER_COUNTRY = 'US';
const USER_CURRENCY = 'USD';
const USER_LANGUAGE = 'en-US';
const COMBINE_URL = `${BASE_URL}/${USER_COUNTRY}/${USER_CURRENCY}/${USER_LANGUAGE}`;

module.exports = {
  Query: {
    getCheapestFlight: async (root, args) => {
      const {
        startingAirport,
        endingAirport,
        outboundDate,
        inboundDate,
      } = args;

      let url = '';
      if (inboundDate) {
        url = `${COMBINE_URL}/${startingAirport}/${endingAirport}/${outboundDate}/${inboundDate}`;
      } else
        url = `${COMBINE_URL}/${startingAirport}/${endingAirport}/${outboundDate}/`;

      const { data } = await axios({
        method: 'GET',
        url,
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': process.env.HOST,
          'x-rapidapi-key': process.env.KEY,
          useQueryString: true,
        },
        params: {
          inboundpartialdate: '2020-12-01',
        },
      });
      const lowestPriceAvailable = data.Quotes.reduce((acc, currFlight) => {
        if (acc.MinPrice > currFlight.MinPrice) {
          acc = currFlight;
        }
        return acc;
      });

      return data.Quotes.filter(
        (flight) => flight.MinPrice === lowestPriceAvailable.MinPrice
      ).map((flight) => {
        if (flight.InboundLeg) {
          return {
            price: flight.MinPrice,
            direct: flight.Direct,
            departureDate: flight.OutboundLeg.DepartureDate,
            returnDate: flight.InboundLeg.DepartureDate,
          };
        } else {
          return {
            price: flight.MinPrice,
            direct: flight.Direct,
            departureDate: flight.OutboundLeg.DepartureDate,
          };
        }
      });
    },
  },
};
