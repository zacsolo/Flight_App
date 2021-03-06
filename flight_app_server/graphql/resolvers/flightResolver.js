const { UserInputError } = require('apollo-server');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

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
//
//
//
//
module.exports = {
  Query: {
    //---FIND ARRAY OF CHEAPEST FLIGHTS FOR GIVEN QUERY----
    getFlightsWithDestRoundTrip: async (root, args) => {
      const {
        startingAirport,
        endingAirport,
        outboundDate,
        inboundDate,
      } = args;

      //__Checking for Errors in Inputs__
      //__If invalid, throw UserInputError__
      const { errors, valid } = flightQueryValidation(
        startingAirport,
        endingAirport,
        outboundDate,
        inboundDate
      );

      if (!valid) {
        console.log(errors);
        throw new UserInputError('Errors', { errors });
      }

      //--- Dynamic URL based on if there is a return flight date selected

      //---Request params for Rapid Api
      const { data } = await axios({
        method: 'GET',
        url: `${COMBINE_QUOTES_URL}/${startingAirport}/${endingAirport}/${outboundDate}/${inboundDate}`,
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': process.env.HOST,
          'x-rapidapi-key': process.env.KEY,
          useQueryString: true,
        },
      });

      //---Check if any flights were returned---
      if (data.Quotes.length < 1) {
        throw new UserInputError('No flights found', {
          errors: 'No flights found',
        });
      }

      console.log(data.Places);
      console.log(data.Quotes);
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
            outboundOrigin: flight.OutboundLeg.OriginId,
            outboundDestination: flight.OutboundLeg.DestinationId,
            returnDate: flight.InboundLeg.DepartureDate,
            inboundOrigin: flight.InboundLeg.OriginId,
            inboundDestination: flight.InboundLeg.DestinationId,
            returnFlightId: flight.InboundLeg.CarrierIds[0],
            outboundCarrierName: carrier[0][0].Name,
          });
        } else {
          outboundFlightCarrierArr.push({
            price: flight.MinPrice,
            direct: flight.Direct,
            departureDate: flight.OutboundLeg.DepartureDate,
            outboundOrigin: flight.OutboundLeg.OriginId,
            outboundDestination: flight.OutboundLeg.DestinationId,
            outboundCarrierName: carrier[0][0].Name,
          });
        }
      });

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

      if (!inboundDate) {
        outboundFlightCarrierArr.map((flight) => {
          const outboundOr = data.Places.filter(
            (place) => place.PlaceId === flight.outboundOrigin
          );
          const outboundDest = data.Places.filter(
            (place) => place.PlaceId === flight.outboundDestination
          );
          return {
            ...flight,
            id: uuidv4(),
            cityName: outboundDest[0].CityName,
            outboundOrigin: `${outboundOr[0].Name}, ${outboundOr[0].IataCode}`,
            outboundDestination: `${outboundDest[0].Name}, ${outboundDest[0].IataCode}`,
          };
        });
      } else {
        return inboundFlightCarrierArr.map((flight) => {
          const outboundOr = data.Places.filter(
            (place) => place.PlaceId === flight.outboundOrigin
          );
          const outboundDest = data.Places.filter(
            (place) => place.PlaceId === flight.outboundDestination
          );
          const inboundOr = data.Places.filter(
            (place) => place.PlaceId === flight.inboundOrigin
          );
          const inboundDest = data.Places.filter(
            (place) => place.PlaceId === flight.inboundDestination
          );
          return {
            ...flight,
            id: uuidv4(),
            cityName: outboundDest[0].CityName,
            outboundOrigin: `${outboundOr[0].Name}, ${outboundOr[0].IataCode}`,
            outboundDestination: `${outboundDest[0].Name}, ${outboundDest[0].IataCode}`,
            inboundOrigin: `${inboundOr[0].Name}, ${inboundOr[0].IataCode}`,
            inboundDestination: `${inboundDest[0].Name}, ${inboundDest[0].IataCode}`,
          };
        });
      }
    },
    //
    //__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--
    //--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__
    //
    getFlightsWithDestOneWay: async (root, args) => {
      const { startingAirport, endingAirport, outboundDate } = args;

      //__Checking for Errors in Inputs__
      //__If invalid, throw UserInputError__
      const { errors, valid } = flightQueryValidation(
        startingAirport,
        endingAirport,
        outboundDate
      );

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      //

      //--- Dynamic URL based on if there is a return flight date selected

      //---Request params for Rapid Api
      const { data } = await axios({
        method: 'GET',
        url: `${COMBINE_QUOTES_URL}/${startingAirport}/${endingAirport}/${outboundDate}/`,
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': process.env.HOST,
          'x-rapidapi-key': process.env.KEY,
          useQueryString: true,
        },
      });

      //
      //---Check if any flights were returned---
      if (data.Quotes.length < 1) {
        throw new UserInputError('No flights found', {
          errors: 'No flights found',
        });
      }
      //

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

      //--Find the CarrierIds--
      //--Finding the outbound Carrier Id
      const outboundId = cheapFlightsArr.map((flight) => {
        return flight.OutboundLeg.CarrierIds;
      });

      //--Returning the corresponding carrier object
      const findCarrierInfoOutbound = outboundId.map((id) => {
        return data.Carriers.filter(
          (flight) => flight.CarrierId === Number(id)
        );
      });

      //
      //FIND THE CORRESPONDING OUTBOUND CARRIER AND NEST IT INTO RETURN OBJ
      //
      const outboundFlightCarrierArr = [];

      //--Map over array of flights matching the cheapest one
      //--Filter the array of Carriers--
      cheapFlightsArr.map((flight) => {
        const carrier = findCarrierInfoOutbound.filter(
          (car) => car[0].CarrierId === flight.OutboundLeg.CarrierIds[0]
        );
        {
          outboundFlightCarrierArr.push({
            price: flight.MinPrice,
            direct: flight.Direct,
            departureDate: flight.OutboundLeg.DepartureDate,
            outboundOrigin: flight.OutboundLeg.OriginId,
            outboundDestination: flight.OutboundLeg.DestinationId,
            outboundCarrierName: carrier[0][0].Name,
          });
        }
      });

      // FIND THE CORRESPONDING INBOUND CARRIER AND NEST IT INTO RETURN OBJ
      //

      return outboundFlightCarrierArr.map((flight) => {
        const outboundOr = data.Places.filter(
          (place) => place.PlaceId === flight.outboundOrigin
        );
        const outboundDest = data.Places.filter(
          (place) => place.PlaceId === flight.outboundDestination
        );
        return {
          ...flight,
          id: uuidv4(),
          cityName: outboundDest[0].CityName,
          outboundOrigin: `${outboundOr[0].Name}, ${outboundOr[0].IataCode}`,
          outboundDestination: `${outboundDest[0].Name}, ${outboundDest[0].IataCode}`,
        };
      });
    },
    //
    //__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--
    //--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__
    //From a chosen airport to ANYWHERE
    //
    cheapestFlightsToAnywhere: async (
      root,
      { startingAirport, searchDate, amountOfResults }
    ) => {
      console.log('BEFORE', amountOfResults);
      //--__Default values for searchData and amountOfResults__--
      if (!searchDate || searchDate.trim() === '') searchDate = 'anytime';
      if (!amountOfResults || amountOfResults < 10) amountOfResults = 10;
      console.log('AFTER', amountOfResults);

      //__ERROR HANDLING FOR USER INPUTS
      const { errors, valid } = flightToAnywhereValidation(
        startingAirport,
        searchDate,
        amountOfResults
      );
      console.log(errors);
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      //
      //
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

      if (amountOfResults > result.data.Quotes.length) {
        amountOfResults = result.data.Quotes.length;
      }

      //---SOME MAGIC I DONT UNDERSTAND
      //--Sorted Array lowest first--
      const compareFlights = (a, b) => {
        let comparison = 0;
        if (a.MinPrice > b.MinPrice) {
          comparison = 1;
        } else if (a.MinPrice < b.MinPrice) {
          comparison = -1;
        }
        return comparison;
      };

      const lowestPriceFirst = result.data.Quotes.sort(compareFlights);
      console.log(
        lowestPriceFirst[0],
        lowestPriceFirst[1],
        lowestPriceFirst[2]
      );
      //
      //
      //
      //--Finds "maximum price displayed", based on user input of how many dispalyed results
      //--Returns results less than the maximum price--
      const sortedBelowCertainPrice = lowestPriceFirst.filter(
        (flight) =>
          flight.MinPrice <=
          lowestPriceFirst[Number(amountOfResults - 1)].MinPrice
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

      //
      //
      //--Combines places and quotes together into single Objects
      //---CREATING NEW ARRAY OF COMBINE NESTED DATA
      const destinationNestedFlightsArr = [];

      sortedBelowCertainPrice.map((f) => {
        const destinationForReturn = matchingDestinations.find(
          (dest) => f.OutboundLeg.DestinationId === dest.PlaceId
        );
        destinationNestedFlightsArr.push({
          price: f.MinPrice,
          direct: f.Direct,
          departureDate: f.OutboundLeg.DepartureDate,
          outboundOrigin: f.OutboundLeg.OriginId,
          outboundDestination: f.OutboundLeg.DestinationId,
          CarrierIds: f.OutboundLeg.CarrierIds[0],
          placeId: destinationForReturn.PlaceId,
          placeName: destinationForReturn.Name,
          cityName: destinationForReturn.CityName,
          countryName: destinationForReturn.CountryName,
          IataCode: destinationForReturn.IataCode,
        });

        return destinationNestedFlightsArr;
      });

      //
      //
      //--Combines carrier and destinationNestedFlights together into single Objects
      //---CREATING NEW ARRAY OF COMBINE NESTED DATA
      const carrierNestedFlight = [];

      destinationNestedFlightsArr.map((f) => {
        const carrier = matchingCarriers.filter((car) => {
          return Number(car.CarrierId) === Number(f.CarrierIds);
        });

        return carrierNestedFlight.push({
          ...f,
          outboundCarrierName: carrier[0].Name,
        });
      });

      return carrierNestedFlight.map((flight) => {
        const outboundOr = result.data.Places.filter(
          (place) => place.PlaceId === flight.outboundOrigin
        );
        const outboundDest = result.data.Places.filter(
          (place) => place.PlaceId === flight.outboundDestination
        );
        return {
          ...flight,
          id: uuidv4(),
          outboundOrigin: `${outboundOr[0].Name}, ${outboundOr[0].IataCode}`,
          outboundDestination: `${outboundDest[0].Name}, ${outboundDest[0].IataCode}`,
        };
      });
    },
    //
    //
    //__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--
    //--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__--__
    //
    //ROUND TRIP TO ANYWHERE
    //
    roundTripFlightToAnywhere: async (
      root,
      { startingAirport, outboundDate, inboundDate, amountOfResults }
    ) => {
      //--__Default values for searchData and amountOfResults__--
      if (!outboundDate || outboundDate.trim() === '') outboundDate = 'anytime';
      if (!inboundDate || inboundDate.trim() === '') inboundDate = 'anytime';
      if (!amountOfResults || amountOfResults < 10) amountOfResults = 50;
      const endingAirport = 'anywhere';
      //__ERROR HANDLING FOR USER INPUTS
      const { errors, valid } = flightQueryValidation(
        startingAirport,
        endingAirport,
        outboundDate,
        inboundDate
      );

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const { data } = await axios({
        method: 'GET',
        url: `${COMBINE_ROUTES_URL}/${startingAirport}/anywhere/${outboundDate}/${inboundDate}`,
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': process.env.HOST,
          'x-rapidapi-key': process.env.KEY,
          useQueryString: true,
        },
      });
      //---SOME MAGIC I DONT UNDERSTAND
      //--Sorted Array lowest first--
      const compareFlights = (a, b) => {
        let comparison = 0;
        if (a.MinPrice > b.MinPrice) {
          comparison = 1;
        } else if (a.MinPrice < b.MinPrice) {
          comparison = -1;
        }
        return comparison;
      };

      const lowestPriceFirst = data.Quotes.sort(compareFlights);

      const sortedBelowCertainPrice = lowestPriceFirst.filter(
        (flight) =>
          flight.MinPrice <=
          lowestPriceFirst[Number(amountOfResults - 1)].MinPrice
      );

      //--Find the CarrierIds--
      //--Finding the outbound Carrier Id
      const outboundId = sortedBelowCertainPrice.map((flight) => {
        return flight.OutboundLeg.CarrierIds;
      });

      //__If there is a return flight
      //__Finding the return flight Carrier Id
      let inboundId = null;
      if (inboundDate) {
        inboundId = sortedBelowCertainPrice.map((flight) => {
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

      //
      //FIND THE CORRESPONDING OUTBOUND CARRIER AND NEST IT INTO RETURN OBJ
      //
      const outboundFlightCarrierArr = [];

      //--Map over array of flights matching the cheapest one
      //--Filter the array of Carriers--
      sortedBelowCertainPrice.map((flight) => {
        const carrier = findCarrierInfoOutbound.filter(
          (car) => car[0].CarrierId === flight.OutboundLeg.CarrierIds[0]
        );
        if (inboundDate) {
          outboundFlightCarrierArr.push({
            price: flight.MinPrice,
            direct: flight.Direct,
            departureDate: flight.OutboundLeg.DepartureDate,
            outboundOrigin: flight.OutboundLeg.OriginId,
            outboundDestination: flight.OutboundLeg.DestinationId,
            returnDate: flight.InboundLeg.DepartureDate,
            inboundOrigin: flight.InboundLeg.OriginId,
            inboundDestination: flight.InboundLeg.DestinationId,
            returnFlightId: flight.InboundLeg.CarrierIds[0],
            outboundCarrierName: carrier[0][0].Name,
          });
        } else {
          outboundFlightCarrierArr.push({
            price: flight.MinPrice,
            direct: flight.Direct,
            departureDate: flight.OutboundLeg.DepartureDate,
            outboundOrigin: flight.OutboundLeg.OriginId,
            outboundDestination: flight.OutboundLeg.DestinationId,
            outboundCarrierName: carrier[0][0].Name,
          });
        }
      });

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

      if (!inboundDate) {
        outboundFlightCarrierArr.map((flight) => {
          const outboundOr = data.Places.filter(
            (place) => place.PlaceId === flight.outboundOrigin
          );
          const outboundDest = data.Places.filter(
            (place) => place.PlaceId === flight.outboundDestination
          );
          return {
            ...flight,
            id: uuidv4(),
            cityName: outboundDest[0].CityName,
            outboundOrigin: `${outboundOr[0].Name}, ${outboundOr[0].IataCode}`,
            outboundDestination: `${outboundDest[0].Name}, ${outboundDest[0].IataCode}`,
          };
        });
      } else {
        return inboundFlightCarrierArr.map((flight) => {
          const outboundOr = data.Places.filter(
            (place) => place.PlaceId === flight.outboundOrigin
          );
          const outboundDest = data.Places.filter(
            (place) => place.PlaceId === flight.outboundDestination
          );
          const inboundOr = data.Places.filter(
            (place) => place.PlaceId === flight.inboundOrigin
          );
          const inboundDest = data.Places.filter(
            (place) => place.PlaceId === flight.inboundDestination
          );

          return {
            ...flight,
            id: uuidv4(),
            cityName: outboundDest[0].CityName,
            outboundOrigin: `${outboundOr[0].Name}, ${outboundOr[0].IataCode}`,
            outboundDestination: `${outboundDest[0].Name}, ${outboundDest[0].IataCode}`,
            inboundOrigin: `${inboundOr[0].Name}, ${inboundOr[0].IataCode}`,
            inboundDestination: `${inboundDest[0].Name}, ${inboundDest[0].IataCode}`,
          };
        });
      }
    },
  },
};
