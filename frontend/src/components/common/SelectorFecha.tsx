import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface SelectorFechaProps {
  label: string;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const SelectorFecha: React.FC<SelectorFechaProps> = ({ label, selectedDate, setSelectedDate }) => {
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date ? date.format('YYYY-MM-DD') : '');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={selectedDate ? dayjs(selectedDate) : null}
        onChange={handleDateChange}
      />
    </LocalizationProvider>
  );
};

export default SelectorFecha;
