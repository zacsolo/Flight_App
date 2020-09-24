import React, { Fragment, useState } from 'react';
import { DatePicker } from '@material-ui/pickers';
import moment from 'moment';

function BasicDatePicker(props) {
  const [selectedDate, handleDateChange] = useState(new Date());

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
          props.name === 'departureDate' ? 'Leaving from?' : 'Returning...'
        }
        value={selectedDate}
        onChange={handleDateChange}
      />
    </Fragment>
  );
}

export default BasicDatePicker;
