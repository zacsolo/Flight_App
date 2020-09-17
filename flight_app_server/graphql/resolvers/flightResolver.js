const { UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const BASE_URL =
  'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0';
const USER_COUNTRY = 'US';
const USER_CURRENCY = 'USD';
const USER_LANGUAGE = 'en-US';
module.exports = {
  Query: {
    getCheapestFlight: async (root, args) => {
      const { startingAirport, endingAirport, outboundDate } = args;

      const { data } = await axios({
        method: 'GET',
        url: `${BASE_URL}/${USER_COUNTRY}/${USER_CURRENCY}/${USER_LANGUAGE}/${startingAirport}/${endingAirport}/${outboundDate}`,
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
      const cheapFlight = data.Quotes.reduce((acc, currFlight) => {
        if (acc.MinPrice > currFlight.MinPrice) {
          acc = currFlight;
        }
        return acc;
      });
      console.log(cheapFlight);
      return {
        price: cheapFlight.MinPrice,
        direct: cheapFlight.Direct,
        departureDate: cheapFlight.OutboundLeg.DepartureDate,
      };
    },
  },
};
