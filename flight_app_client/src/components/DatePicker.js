import React, { Fragment, useState, useEffect } from 'react';
import { DatePicker } from '@material-ui/pickers';
import moment from 'moment';
import CheckBox from '../components/CheckBox';

function BasicDatePicker(props) {
  const [selectedDate, handleDateChange] = useState(null);
  const [anytimeName, setAnytimeName] = useState('');

  useEffect(() => {
    if (props.disableDates) {
      handleDateChange(null);
      setAnytimeName('Anytime');
    } else {
      setAnytimeName('');
    }
  }, [props.disableDates]);
  return (
    <Fragment>
      {/* <DatePicker
        autoOk
        disablePast
        onAccept={(date) => {
          const newDate = moment(date._d)
            .format('YYYY/MM/DD')
            .split('/')
            .join('-');
          console.log(newDate);
          props.updateDate(newDate, props.name);
          return date;
        }}
        label='Basic example'
        value={selectedDate}
        onChange={handleDateChange}
        animateYearScrolling
      /> */}

      <DatePicker
        disabled={props.disableDates ? true : false}
        autoOk
        disablePast
        variant='inline'
        openTo='year'
        views={['year', 'month']}
        onAccept={(date) => {
          const newDate = moment(date._d)
            .format('YYYY/MM')
            .split('/')
            .join('-');
          console.log(newDate);
          props.updateDate(newDate, props.name);
          return date;
        }}
        label={
          anytimeName === 'Anytime'
            ? 'Anytime'
            : props.name === 'departureDate'
            ? 'Departure'
            : 'Return'
        }
        value={selectedDate}
        onChange={handleDateChange}
      />
    </Fragment>
  );
}

export default BasicDatePicker;
