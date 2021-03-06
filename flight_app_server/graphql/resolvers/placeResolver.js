const { UserInputError } = require('apollo-server');
const axios = require('axios');

//
//
//--Possible Future Variables, right now static---------
const PLACES_URL =
  'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0';
const USER_COUNTRY = 'US';
const USER_CURRENCY = 'USD';
const USER_LANGUAGE = 'en-US';
const COMBINE_PLACES_URL = `${PLACES_URL}/${USER_COUNTRY}/${USER_CURRENCY}/${USER_LANGUAGE}/`;
//------------------------------------------------------
//
//
//

module.exports = {
  Query: {
    findAirport: async (root, { airportSearch }) => {
      //--Checks if search query is empty
      if (!airportSearch || airportSearch.trim() === '') {
        throw new UserInputError('Field cannot be empty', {
          errors: { airportSearch: 'Field cannot be empty' },
        });
      }
      if (Number(airportSearch)) {
        throw new UserInputError('Value cannot be of type number', {
          errors: { airportSearch: 'cannot be a number' },
        });
      }
      const result = await axios({
        method: 'GET',
        url: COMBINE_PLACES_URL,
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': process.env.HOST,
          'x-rapidapi-key': process.env.KEY,
          useQueryString: true,
        },
        params: {
          query: airportSearch,
        },
      });

      return result.data.Places.map((place) => {
        return {
          placeId: place.PlaceId,
          placeName: place.PlaceName,
          regionId: place.RegionId,
          cityId: place.CityId,
          countryId: place.CountryId,
          countryName: place.CountryName,
        };
      });
    },
  },
};
