import React from 'react';
import Paper from '@material-ui/core/Paper';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import { CardContent, Typography } from '@material-ui/core';
import { useStyles } from './styles/StyledPriceGraph';

export default function PriceGraph({ oldPrice, newPrice }) {
  const cheaper = oldPrice > newPrice;
  const classes = useStyles(cheaper);
  return (
    <>
      <Paper className={classes.graphWrapper} elevation={3}>
        <Typography
          variant='h5'
          color='textSecondary'
          className={classes.originalPriceText}>
          ${oldPrice}
        </Typography>
        <div className={classes.trendLine}>
          {cheaper ? (
            <TrendingDownIcon color='primary' className={classes.graphIcon} />
          ) : (
            <TrendingUpIcon color='secondary' className={classes.graphIcon} />
          )}
        </div>
        <Typography
          variant='h5'
          color={cheaper ? 'primary' : 'secondary'}
          className={classes.newPriceText}>
          ${newPrice}
        </Typography>
      </Paper>
      <CardContent>
        <Typography variant='subtitle2' color='textSecondary'>
          Recent price {cheaper ? 'decrease' : 'increase'} of{' '}
          <Typography
            component='span'
            variant='subtitle2'
            color={cheaper ? 'primary' : 'secondary'}>
            ${Math.abs(newPrice - oldPrice)}
          </Typography>
        </Typography>
      </CardContent>
    </>
  );
}
