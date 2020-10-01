import React, { useState, useEffect } from 'react';
import { DatePicker } from '@material-ui/pickers';
import moment from 'moment';

function BasicDatePicker(props) {
  const [selectedDate, handleDateChange] = useState(null);
  const [anytimeName, setAnytimeName] = useState('');

  useEffect(() => {
    if (props.disableDates && props.disableForOneWay) {
      handleDateChange(null);
      setAnytimeName('One-way');
    }
    if (props.disableDates && !props.disableForOneWay) {
      handleDateChange(null);
      setAnytimeName('Anytime');
    } else if (props.disableForOneWay && !props.disableDates) {
      setAnytimeName('One-way');
    } else if (!props.disableForOneWay && !props.disableDates) {
      setAnytimeName('');
    }
  }, [props.disableDates, props.disableForOneWay]);

  return (
    <DatePicker
      disabled={props.disableForOneWay || (props.disableDates && true)}
      autoOk
      error={props.error && anytimeName.toLowerCase() !== 'anytime'}
      disablePast
      variant='inline'
      openTo='year'
      views={['year', 'month']}
      onAccept={(date) => {
        const newDate = moment(date._d).format('YYYY/MM').split('/').join('-');
        props.updateDate(newDate, props.name);
        return date;
      }}
      label={
        anytimeName === 'Anytime'
          ? 'Anytime'
          : anytimeName === 'One-way'
          ? 'One-way'
          : props.name === 'outboundDate'
          ? 'Departure'
          : 'Return'
      }
      value={selectedDate}
      onChange={handleDateChange}
    />
  );
}

export default BasicDatePicker;
