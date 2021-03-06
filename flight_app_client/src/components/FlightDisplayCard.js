import React from 'react';

import Card from '@material-ui/core/Card';

import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import RemoveIcon from '@material-ui/icons/Remove';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import FlightLandIcon from '@material-ui/icons/FlightLand';

import moment from 'moment';
import SaveFlightButton from './SaveFlightButton';
import { Grow } from '@material-ui/core';

export default function FlightDisplayCard({
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
    <>
      {returnDate ? (
        <Grow
          in={true}
          style={{ transformOrigin: '0 0 0 0' }}
          {...(true ? { timeout: 1000 } : {})}>
          <Card elevation={3} style={{ marginBottom: 10 }}>
            <CardContent>
              <Typography variant='subtitle1' color='textSecondary'>
                from {outboundOrigin.split(',')[0]}
              </Typography>
              <Typography variant={cityName.length < 10 ? 'h4' : 'h5'}>
                {cityName}
              </Typography>
            </CardContent>
            {/* PRICE CARD START */}
            <CardContent
              style={{
                display: 'flex',
                flexDirection: 'column',
                margin: 0,
                padding: 0,
              }}>
              <CardContent>
                <Typography color='primary' variant='h4'>
                  ${price}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  {direct ? 'Direct' : 'Multi-stop'}
                </Typography>
              </CardContent>
              <br />
              <CardContent
                style={{
                  padding: 0,
                  display: 'flex',
                  justifyContent: 'space-around',
                }}>
                <Button
                  color='primary'
                  startIcon={<ShoppingCartOutlinedIcon />}>
                  Buy
                </Button>
                <SaveFlightButton
                  flight={flight}
                  saved={saved}
                  removeSingleFlight={removeSingleFlight}
                />
              </CardContent>
            </CardContent>
            {/* PRICE CARD END */}
            <CardContent style={{ width: '100%', padding: '0' }}>
              <CardContent
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 0,
                }}>
                <CardContent align='left' style={{ padding: 0 }}>
                  <Typography variant='subtitle2' color='textSecondary'>
                    {outboundCarrierName}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    {moment(departureDate).format('MM/DD/YYYY')}
                  </Typography>
                </CardContent>
                <CardContent>
                  <FlightTakeoffIcon />
                </CardContent>
                <CardContent
                  style={{
                    display: 'flex',
                    width: '35%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Typography variant='h6' component='p'>
                    {outboundOrigin.split(',')[1]}
                  </Typography>
                  {direct ? <RemoveIcon /> : <LinearScaleIcon />}

                  <Typography variant='h6' component='p'>
                    {outboundDestination.split(',')[1]}
                  </Typography>
                </CardContent>
              </CardContent>

              <CardContent
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 16,
                  paddingTop: 0,
                }}>
                <CardContent align='left' style={{ padding: 0 }}>
                  <Typography variant='subtitle2' color='textSecondary'>
                    {inboundCarrierName}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    {moment(returnDate).format('MM/DD/YYYY')}
                  </Typography>
                </CardContent>
                <CardContent>
                  <FlightLandIcon />
                </CardContent>

                <CardContent
                  style={{
                    display: 'flex',
                    width: '35%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Typography variant='h6' component='p'>
                    {inboundOrigin.split(',')[1]}
                  </Typography>
                  {direct ? <RemoveIcon /> : <LinearScaleIcon />}

                  <Typography variant='h6' component='p'>
                    {inboundDestination.split(',')[1]}
                  </Typography>
                </CardContent>
              </CardContent>
            </CardContent>
          </Card>
        </Grow>
      ) : (
        <Grow
          in={true}
          style={{ transformOrigin: '0 0 0 0' }}
          {...(true ? { timeout: 1000 } : {})}>
          <Card elevation={3} style={{ marginBottom: 10 }}>
            <CardContent>
              <Typography variant='subtitle1' color='textSecondary'>
                from {outboundOrigin.split(',')[0]}
              </Typography>
              <Typography variant={cityName.length < 10 ? 'h4' : 'h5'}>
                {cityName}
              </Typography>
            </CardContent>
            {/* PRICE CARD START */}
            <CardContent
              style={{
                display: 'flex',
                flexDirection: 'column',
                margin: 0,
                padding: 0,
              }}>
              <CardContent>
                <Typography color='primary' variant='h4'>
                  ${price}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  {direct ? 'Direct' : 'Multi-stop'}
                </Typography>
              </CardContent>
              <br />
              <CardContent
                style={{
                  padding: 0,
                  display: 'flex',
                  justifyContent: 'space-around',
                }}>
                <Button
                  color='primary'
                  startIcon={<ShoppingCartOutlinedIcon />}>
                  Buy
                </Button>
                <SaveFlightButton
                  flight={flight}
                  saved={saved}
                  removeSingleFlight={removeSingleFlight}
                />
              </CardContent>
            </CardContent>

            {/* PRICE CARD END */}
            <CardContent style={{ width: '100%', padding: '0' }}>
              <CardContent
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '24px 16px',
                }}>
                <CardContent align='left' style={{ padding: 0 }}>
                  <Typography variant='subtitle2' color='textSecondary'>
                    {outboundCarrierName}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    {moment(departureDate).format('MM/DD/YYYY')}
                  </Typography>
                </CardContent>

                <FlightTakeoffIcon />

                {/* Flight Abrv */}
                <CardContent
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 0,
                  }}>
                  <Typography variant='h6' component='p'>
                    {outboundOrigin.split(',')[1]}
                  </Typography>
                  {direct ? <RemoveIcon /> : <LinearScaleIcon />}
                  <Typography variant='h6' component='p'>
                    {outboundDestination.split(',')[1]}
                  </Typography>
                </CardContent>
                {/* Flight Abrv */}
              </CardContent>
            </CardContent>
          </Card>
        </Grow>
      )}
    </>
  );
}
