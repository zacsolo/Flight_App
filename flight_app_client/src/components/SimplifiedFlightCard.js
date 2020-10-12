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
import '../FlightDisplayCard.css';
import moment from 'moment';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import SaveFlightButton from './SaveFlightButton';
import PriceGraph from './PriceGraph';

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
    <>
      {returnDate ? (
        <Card
          elevation={3}
          style={{ marginBottom: 10, position: 'relative', borderRadius: 15 }}>
          <CardContent style={{ paddingBottom: 0 }}>
            <Typography variant='subtitle1' color='textSecondary'>
              from {outboundOrigin.split(',')[0]}
            </Typography>
            <Typography variant={cityName.length < 10 ? 'h4' : 'h5'}>
              {cityName}
            </Typography>
            <Typography variant='caption' color='textSecondary'>
              Round-trip
            </Typography>
            <CardContent style={{ padding: '40px 0 0' }}>
              <Typography variant='subtitle2' color='textSecondary'>
                {moment(departureDate).format('llll').split(', 202')[0]} -{' '}
                {moment(returnDate).format('llll').split(', 202')[0]}
              </Typography>
            </CardContent>
          </CardContent>

          {/* PRICE CARD START */}
          <CardContent
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: 0,
              padding: 0,
            }}>
            <CardContent style={{ paddingBottom: 0 }}>
              <CardContent
                style={{
                  maxHeight: '30vh',
                  paddingTop: 0,
                  paddingBottom: 0,
                  width: '80%',
                  margin: 'auto',
                }}>
                <PriceGraph
                  oldPrice={price}
                  newPrice={
                    Math.random() > 0.5
                      ? price + Math.floor(Math.random() * 100)
                      : price - Math.floor(Math.random() * 100)
                  }
                />
              </CardContent>
            </CardContent>
            <br />
            <CardContent style={{ paddingTop: 0 }}>
              <Button
                color='primary'
                style={{ borderRadius: 50, marginRight: '20px' }}>
                <ShoppingCartOutlinedIcon fontSize='large' />
              </Button>
              <SaveFlightButton
                flight={flight}
                saved={saved}
                removeSingleFlight={removeSingleFlight}
              />
            </CardContent>
          </CardContent>
        </Card>
      ) : (
        <Card elevation={3} style={{ marginBottom: 10, position: 'relative' }}>
          <CardContent>
            <Typography variant='h4'>{cityName}</Typography>
          </CardContent>
          <CardContent style={{ position: 'absolute', top: '0', right: '0' }}>
            <ArrowUpwardIcon color='primary' fontSize='large' />
            <Typography color='primary' variant='body2'>
              $30
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
              <CardContent
                style={{
                  margin: '0 ',
                  padding: 0,
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <Typography color='primary' variant='h4'>
                  ${price}
                </Typography>
              </CardContent>

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
              <Button color='primary'>
                <ShoppingCartOutlinedIcon />
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
          </CardContent>
        </Card>
      )}
    </>
  );
}
