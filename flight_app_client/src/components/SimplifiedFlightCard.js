import React from 'react';

import CardContent from '@material-ui/core/CardContent';

import Typography from '@material-ui/core/Typography';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import moment from 'moment';
import SaveFlightButton from './SaveFlightButton';
import PriceGraph from './PriceGraph';
import {
  BuyButton,
  DateContainer,
  FlightCard,
  TitleContainer,
  InfoContainer,
  ActionsContainer,
  Graph,
} from './StylesSimpleFlightCard';

export default function SimplifiedFlightCard({
  flight: {
    price,
    direct,
    departureDate,
    outboundCarrierName,
    returnDate,
    inboundCarrierName,
    outboundOrigin,
    outboundDestination,
    inboundOrigin,
    inboundDestination,
    cityName,
  },
  saved,
  removeSingleFlight,
}) {
  //Passing this object to the saveflight button
  const flight = {
    price,
    direct,
    departureDate,
    outboundCarrierName,
    returnDate,
    inboundCarrierName,
    outboundOrigin,
    outboundDestination,
    inboundOrigin,
    inboundDestination,
    cityName,
  };

  return (
    <FlightCard elevation={3}>
      <TitleContainer>
        <Typography variant='subtitle1' color='textSecondary'>
          from {outboundOrigin.split(',')[0]}
        </Typography>
        <Typography variant={cityName.length < 10 ? 'h4' : 'h5'}>
          {cityName}
        </Typography>

        <Typography variant='caption' color='textSecondary'>
          {returnDate ? 'Round-trip' : 'One-way'}
        </Typography>

        <DateContainer>
          {returnDate ? (
            <Typography variant='subtitle2' color='textSecondary'>
              {moment(departureDate).format('llll').split(', 202')[0]} -{' '}
              {moment(returnDate).format('llll').split(', 202')[0]}
            </Typography>
          ) : (
            <Typography variant='subtitle2' color='textSecondary'>
              {moment(departureDate).format('llll').split(', 202')[0]}
            </Typography>
          )}
        </DateContainer>
      </TitleContainer>
      <InfoContainer>
        <Graph>
          <PriceGraph
            oldPrice={price}
            newPrice={
              Math.random() > 0.5
                ? price + Math.floor(Math.random() * 100)
                : price - Math.floor(Math.random() * 100)
            }
          />
        </Graph>
        <ActionsContainer>
          <BuyButton color='primary'>
            <ShoppingCartOutlinedIcon fontSize='large' />
          </BuyButton>
          <SaveFlightButton
            flight={flight}
            saved={saved}
            removeSingleFlight={removeSingleFlight}
          />
        </ActionsContainer>
      </InfoContainer>
    </FlightCard>
  );
}
