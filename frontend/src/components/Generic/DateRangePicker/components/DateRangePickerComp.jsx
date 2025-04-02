import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DateRangePickerStyles } from '../styles/DateRangePickerStyles';
import { DateRangePickerUtils } from '../utils/DateRangePickerUtils';

const DateRangePickerComp = ({ startDate, endDate, onChange }) => {
  const handleDatesChange = (type, date) => {
    if (onChange) {
      onChange({
        startDate: type === 'start' ? date : startDate,
        endDate: type === 'end' ? date : endDate
      });
    }
  };

  return (
    <div className="d-flex mb-3">
      <DateRangePickerStyles.StyledDatePicker
        selected={startDate}
        onChange={(date) => handleDatesChange('start', date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        className="form-control"
        dateFormat="dd/MM/yyyy"
      />
      <DateRangePickerStyles.StyledDatePicker
        selected={endDate}
        onChange={(date) => handleDatesChange('end', date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        className="form-control"
        dateFormat="dd/MM/yyyy"
      />
    </div>
  );
};

export default DateRangePickerComp; 