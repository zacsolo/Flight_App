import React, { useState, useEffect } from 'react';
import { DatePicker } from '@material-ui/pickers';
import moment from 'moment';

function BasicDatePicker({
  disableDates,
  disableForOneWay,
  error,
  updateDate,
  name,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [anytimeName, setAnytimeName] = useState('');

  useEffect(() => {
    if (disableDates) {
      setSelectedDate(null);
      if (disableForOneWay) setAnytimeName('One-way');
      else setAnytimeName('Anytime');
    } else {
      if (disableForOneWay) setAnytimeName('One-way');
      else setAnytimeName('');
    }
  }, [disableDates, disableForOneWay]);

  return (
    <DatePicker
      disabled={disableForOneWay || disableDates}
      autoOk
      error={error && anytimeName.toLowerCase() !== 'anytime'}
      disablePast
      variant='inline'
      openTo='year'
      views={['year', 'month']}
      onAccept={(date) => {
        const newDate = moment(date._d).format('YYYY/MM').split('/').join('-');
        updateDate(newDate, name);
        return date;
      }}
      label={
        anytimeName === 'Anytime'
          ? 'Anytime'
          : anytimeName === 'One-way'
          ? 'One-way'
          : name === 'outboundDate'
          ? 'Departure'
          : 'Return'
      }
      value={selectedDate}
      onChange={setSelectedDate}
    />
  );
}

export default BasicDatePicker;
