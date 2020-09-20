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
      //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
      //__Checking for Errors in Inputs__
      //__If invalid, throw UserInputError__
      const { errors, valid } = flightQueryValidation(
        startingAirport,
        endingAirport,
        outboundDate,
        inboundDate
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

      //--- Dynamic URL based on if there is a return flight date selected
      let url = '';
      if (inboundDate) {
        url = `${COMBINE_QUOTES_URL}/${startingAirport}/${endingAirport}/${outboundDate}/${inboundDate}`;
      } else
        url = `${COMBINE_QUOTES_URL}/${startingAirport}/${endingAirport}/${outboundDate}/`;

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

      //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
      //---Check if any flights were returned---
      if (data.Quotes.length < 1) {
        throw new UserInputError('No flights found', {
          errors: 'No flights found',
        });
      }
      //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

      //---Finding the single lowest price flight
      const lowestPriceAvailable = data.Quotes.reduce((acc, currFlight) => {
        if (acc.MinPrice > currFlight.MinPrice) {
          acc = currFlight;
        }
        return acc;
      });

      //---Returning all flights that match the lowest price flight
      const cheapFlightsArr = data.Quotes.filter(
        (flight) => flight.MinPrice === lowestPriceAvailable.MinPrice
      );
      console.log('CHEAPEST FLIGHTS LENGTH-------->', cheapFlightsArr.length);

      //--Find the CarrierIds--
      //--Finding the outbound Carrier Id
      const outboundId = cheapFlightsArr.map((flight) => {
        return flight.OutboundLeg.CarrierIds;
      });

      //__If there is a return flight
      //__Finding the return flight Carrier Id
      let inboundId = null;
      if (inboundDate) {
        inboundId = cheapFlightsArr.map((flight) => {
          return flight.InboundLeg.CarrierIds;
        });
      }
      //--Returning the corresponding carrier object
      const findCarrierInfoOutbound = outboundId.map((id) => {
        return data.Carriers.filter(
          (flight) => flight.CarrierId === Number(id)
        );
      });

      //__If there is a return flight
      //--Returning the corresponding carrier object
      let findCarrierInfoInbound = null;
      if (inboundDate) {
        findCarrierInfoInbound = inboundId.map((id) => {
          return data.Carriers.filter(
            (flight) => flight.CarrierId === Number(id)
          );
        });
      }

      //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
      //FIND THE CORRESPONDING OUTBOUND CARRIER AND NEST IT INTO RETURN OBJ
      //
      const outboundFlightCarrierArr = [];

      //--Map over array of flights matching the cheapest one
      //--Filter the array of Carriers--
      cheapFlightsArr.map((flight) => {
        const carrier = findCarrierInfoOutbound.filter(
          (car) => car[0].CarrierId === flight.OutboundLeg.CarrierIds[0]
        );
        if (inboundDate) {
          outboundFlightCarrierArr.push({
            price: flight.MinPrice,
            direct: flight.Direct,
            departureDate: flight.OutboundLeg.DepartureDate,
            returnDate: flight.InboundLeg.DepartureDate,
            returnFlightId: flight.InboundLeg.CarrierIds[0],
            outBoundCarrierName: carrier[0][0].Name,
          });
        } else {
          outboundFlightCarrierArr.push({
            price: flight.MinPrice,
            direct: flight.Direct,
            departureDate: flight.OutboundLeg.DepartureDate,
            outBoundCarrierName: carrier[0][0].Name,
          });
        }
      });

      //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

      //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
      //FIND THE CORRESPONDING INBOUND CARRIER AND NEST IT INTO RETURN OBJ
      //
      const inboundFlightCarrierArr = [];
      if (inboundDate) {
        outboundFlightCarrierArr.map((flight) => {
          const carrier = findCarrierInfoInbound.filter(
            (car) => car[0].CarrierId === flight.returnFlightId
          );
          return inboundFlightCarrierArr.push({
            ...flight,
            inboundCarrierName: carrier[0][0].Name,
          });
        });
      }
      console.log('RETURN FLIGHT__', inboundFlightCarrierArr);

      //
      //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
      //---Returning all flights that match the lowest price flight
      if (!inboundDate) {
        return outboundFlightCarrierArr.map((flightInfo) => {
          return {
            ...flightInfo,
          };
        });
      } else {
        return inboundFlightCarrierArr.map((flightInfo) => {
          return {
            ...flightInfo,
          };
        });
      }
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

      const matchingCarriers = sortedBelowCertainPrice.reduce((a, o1) => {
        const match = result.data.Carriers.find(
          (o2) => o1.OutboundLeg.CarrierIds[0] === o2.CarrierId
        );
        match && a.push(match);
        return a;
      }, []);

      //--------------------------------------------------
      //
      //--Combines places and quotes together into single Objects
      //---CREATING NEW ARRAY OF COMBINE NESTED DATA
      const nestedFlights = [];

      sortedBelowCertainPrice.map((f) => {
        const destinationForReturn = matchingDestinations.find(
          (dest) => f.OutboundLeg.DestinationId === dest.PlaceId
        );
        nestedFlights.push({
          price: f.MinPrice,
          direct: f.Direct,
          departureDate: f.OutboundLeg.DepartureDate,
          CarrierIds: f.OutboundLeg.CarrierIds[0],
          placeId: destinationForReturn.PlaceId,
          placeName: destinationForReturn.Name,
          cityName: destinationForReturn.CityName,
          countryName: destinationForReturn.CountryName,
          IataCode: destinationForReturn.IataCode,
        });

        return nestedFlights;
      });

      const carrierNestedFlight = [];

      nestedFlights.map((f) => {
        const carrier = matchingCarriers.filter((car) => {
          return Number(car.CarrierId) === Number(f.CarrierIds);
        });

        return carrierNestedFlight.push({
          ...f,
          outboundCarrierName: carrier[0].Name,
        });
      });

      //--------------------------------------------------
      return carrierNestedFlight.map((f) => {
        return {
          ...f,
        };
      });
    },
  },
};
