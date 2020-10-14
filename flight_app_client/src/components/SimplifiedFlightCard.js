import React from 'react';
import Typography from '@material-ui/core/Typography';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import moment from 'moment';
import SaveFlightButton from './SaveFlightButton';
import PriceGraph from './PriceGraph';
import {
  BuyButton,
  Date,
  FlightCard,
  TitleContainer,
  InfoContainer,
  Actions,
  Graph,
} from './styles/StyledSimpleFlightCard';

export default function SimplifiedFlightCard({
  flight: f,
  saved,
  removeSingleFlight,
}) {
  return (
    <FlightCard elevation={3}>
      <TitleContainer>
        <Typography variant='subtitle1' color='textSecondary'>
          from {f.outboundOrigin.split(',')[0]}
        </Typography>
        <Typography variant={f.cityName.length < 10 ? 'h4' : 'h5'}>
          {f.cityName}
        </Typography>
        <Typography variant='caption' color='textSecondary'>
          {f.returnDate ? 'Round-trip' : 'One-way'}
        </Typography>
        <Date>
          <Typography variant='subtitle2' color='textSecondary'>
            {moment(f.departureDate).format('llll').split(', 202')[0]}
            {f.returnDate &&
              `- ${moment(f.returnDate).format('llll').split(', 202')[0]}`}
          </Typography>
        </Date>
      </TitleContainer>
      <InfoContainer>
        <Graph>
          <PriceGraph
            oldPrice={f.price}
            newPrice={
              Math.random() > 0.5
                ? f.price + Math.floor(Math.random() * 100)
                : f.price - Math.floor(Math.random() * 100)
            }
          />
        </Graph>
        <Actions>
          <BuyButton color='primary'>
            <ShoppingCartOutlinedIcon fontSize='large' />
          </BuyButton>
          <SaveFlightButton
            flight={{ ...f }}
            saved={saved}
            removeSingleFlight={removeSingleFlight}
          />
        </Actions>
      </InfoContainer>
    </FlightCard>
  );
}
