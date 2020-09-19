const { UserInputError } = require('apollo-server');
const axios = require('axios');

const {
  flightQueryValidation,
  flightToAnywhereValidation,
} = require('../../utils/flightValidation');

//
//
//--Possible Future Variables, right now static---------
const QUOTES_URL =
  'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0';
const ROUTES_URL =
  'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0';
const USER_COUNTRY = 'US';
const USER_CURRENCY = 'USD';
const USER_LANGUAGE = 'en-US';
const COMBINE_QUOTES_URL = `${QUOTES_URL}/${USER_COUNTRY}/${USER_CURRENCY}/${USER_LANGUAGE}`;
const COMBINE_ROUTES_URL = `${ROUTES_URL}/${USER_COUNTRY}/${USER_CURRENCY}/${USER_LANGUAGE}`;
//------------------------------------------------------
//
//
//
module.exports = {
  Query: {
    //--------------------------------------------------------
    //---FIND ARRAY OF CHEAPEST FLIGHTS FOR GIVEN QUERY----
    getCheapestFlightsForQuery: async (root, args) => {
      const {
        startingAirport,
        endingAirport,
        outboundDate,
        inboundDate,
      } = args;

      const { errors, valid } = flightQueryValidation(
        startingAirport,
        endingAirport,
        outboundDate,
        inboundDate
      );
      //   ---If any args are invalid format
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      //--- Dynamic URL based on if there is a return flight date selected
      let url = '';
      if (inboundDate) {
        url = `${COMBINE_QUOTES_URL}/${startingAirport}/${endingAirport}/${outboundDate}/${inboundDate}`;
      } else
        url = `${COMBINE_QUOTES_URL}/${startingAirport}/${endingAirport}/${outboundDate}/`;
      console.log('URL', url);
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
    //------------------//------------------//------------------//------------------//------------------
    //
    //---FIND ARRAY OF FLIGHTS TO ANYWHERE-----
    cheapestFlightsToAnywhere: async (
      root,
      { startingAirport, searchDate, amountOfResults }
    ) => {
      //--Default values for searchData and amountOfResults--
      if (!searchDate || searchDate.trim() === '') searchDate = 'anytime';
      if (!amountOfResults || amountOfResults.toString().length < 10)
        amountOfResults = 10;

      const { errors, valid } = flightToAnywhereValidation(
        startingAirport,
        searchDate,
        amountOfResults
      );
      //--Checking for errors in user inputs-------
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      //--Requesting data from API with query string----
      const result = await axios({
        method: 'GET',
        url: `${COMBINE_ROUTES_URL}/${startingAirport}/anywhere/${searchDate}`,
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': process.env.HOST,
          'x-rapidapi-key': process.env.KEY,
          useQueryString: true,
        },
      });

      //---SOME MAGIC I DONT UNDERSTAND--------
      const compareFlights = (a, b) => {
        let comparison = 0;
        if (a.MinPrice > b.MinPrice) {
          comparison = 1;
        } else if (a.MinPrice < b.MinPrice) {
          comparison = -1;
        }
        return comparison;
      };
      //----------------------------------------
      //
      //--Sorted Array lowest first--
      const lowestPriceFirst = result.data.Quotes.sort(compareFlights);
      //
      //--Finds "maximum price displayed", based on user input of how many dispalyed results
      const toBeCheaperThan =
        lowestPriceFirst[Number(amountOfResults - 1)].MinPrice;

      //--Returns results less than the maximum price--
      const sortedBelowCertainPrice = lowestPriceFirst.filter(
        (flight) => flight.MinPrice <= toBeCheaperThan
      );
      //
      //--Finds corresponding Places that match to Quotes.
      //-------I DO NOT REALLY UNDERSTAND THIS------------
      const matchingDestinations = sortedBelowCertainPrice.reduce((a, o1) => {
        const match = result.data.Places.find(
          (o2) => o1.OutboundLeg.DestinationId === o2.PlaceId
        );
        match && a.push(match);
        return a;
      }, []);

      //--------------------------------------------------
      //
      //--Combines places and quotes together into single Objects
      //---CREATING NEW ARRAY OF COMBINE NESTED DATA
      const nestedFlights = [];

      sortedBelowCertainPrice.map((flight) => {
        const destinationForReturn = matchingDestinations.find(
          (dest) => flight.OutboundLeg.DestinationId === dest.PlaceId
        );
        nestedFlights.push({ ...flight, ...destinationForReturn });

        return nestedFlights;
      });
      //--------------------------------------------------
      return nestedFlights.map((f) => {
        return {
          price: f.MinPrice,
          direct: f.Direct,
          departureDate: f.OutboundLeg.DepartureDate,
          returnDate: null,
          placeId: f.PlaceId,
          placeName: f.Name,
          cityName: f.CityName,
          countryName: f.CountryName,
          IataCode: f.IataCode,
        };
      });
    },
  },
};
