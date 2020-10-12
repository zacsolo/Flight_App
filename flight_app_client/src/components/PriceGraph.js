import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import { CardContent, Typography } from '@material-ui/core';

export default function PriceGraph({ oldPrice, newPrice }) {
  return (
    <>
      <Paper
        style={{ position: 'relative', height: 150, borderRadius: 15 }}
        elevation={3}>
        {oldPrice > newPrice ? (
          <>
            <Typography
              variant='h5'
              color='textSecondary'
              style={{ position: 'absolute', top: '10%', left: '10%' }}>
              ${oldPrice}
            </Typography>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}>
              <TrendingDownIcon color='primary' style={{ fontSize: 60 }} />
            </div>
            <Typography
              variant='h5'
              color='primary'
              style={{ position: 'absolute', bottom: '10%', right: '10%' }}>
              ${newPrice}
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant='h5'
              color='textSecondary'
              style={{ position: 'absolute', bottom: '10%', left: '10%' }}>
              ${oldPrice}
            </Typography>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}>
              <TrendingUpIcon color='secondary' style={{ fontSize: 60 }} />
            </div>
            <Typography
              variant='h5'
              color='secondary'
              style={{ position: 'absolute', top: '10%', right: '10%' }}>
              ${newPrice}
            </Typography>
          </>
        )}
      </Paper>
      <CardContent>
        <Typography variant='subtitle2' color='textSecondary'>
          Recent price {oldPrice > newPrice ? 'decrease' : 'increase'} of{' '}
          <Typography
            variant='subtitle2'
            display='inline'
            color={oldPrice > newPrice ? 'primary' : 'secondary'}>
            ${Math.abs(newPrice - oldPrice)}
          </Typography>
        </Typography>
      </CardContent>
    </>
  );
}
