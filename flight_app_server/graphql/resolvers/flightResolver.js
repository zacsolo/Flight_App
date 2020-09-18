const { UserInputError } = require('apollo-server');
const axios = require('axios');
const { flightValidation } = require('../../utils/flightValidation');

//
//
//--Possible Future Variables, right now static---------
const QUOTES_URL =
  'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0';
const USER_COUNTRY = 'US';
const USER_CURRENCY = 'USD';
const USER_LANGUAGE = 'en-US';
const COMBINE_URL = `${QUOTES_URL}/${USER_COUNTRY}/${USER_CURRENCY}/${USER_LANGUAGE}`;
//------------------------------------------------------
//
//
//
module.exports = {
  Query: {
    //
    //FIND ARRAY OF CHEAPEST FLIGHTS----
    getCheapestFlight: async (root, args) => {
      const {
        startingAirport,
        endingAirport,
        outboundDate,
        inboundDate,
      } = args;

      const { errors, valid } = flightValidation(
        startingAirport,
        endingAirport,
        outboundDate,
        inboundDate
      );
      //---If any args are invalid format
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      //--- Dynamic URL based on if there is a return flight date selected
      let url = '';
      if (inboundDate) {
        url = `${COMBINE_URL}/${startingAirport}/${endingAirport}/${outboundDate}/${inboundDate}`;
      } else
        url = `${COMBINE_URL}/${startingAirport}/${endingAirport}/${outboundDate}/`;

      //---Request params for Rapid Api
      const { data } = await axios({
        method: 'GET',
        url,
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': process.env.HOST,
          'x-rapidapi-key': process.env.KEY,
          useQueryString: true,
        },
      });

      //---Check if any flights were returned
      if (data.Quotes.length < 1) {
        throw new UserInputError('No flights found', {
          errors: 'No flights found',
        });
      }

      //---Finding the lowest price flight
      const lowestPriceAvailable = data.Quotes.reduce((acc, currFlight) => {
        if (acc.MinPrice > currFlight.MinPrice) {
          acc = currFlight;
        }
        return acc;
      });

      //---Returning all flights that match the lowest price flight
      return data.Quotes.filter(
        (flight) => flight.MinPrice === lowestPriceAvailable.MinPrice
      ).map((flight) => {
        const foundFlightObjPattern = {
          price: flight.MinPrice,
          direct: flight.Direct,
          departureDate: flight.OutboundLeg.DepartureDate,
        };

        if (flight.InboundLeg) {
          return {
            ...foundFlightObjPattern,
            returnDate: flight.InboundLeg.DepartureDate,
          };
        } else {
          return {
            ...foundFlightObjPattern,
          };
        }
      });
    },
  },
};
