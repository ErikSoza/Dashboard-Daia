import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

interface CalendarioProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const Calendario: React.FC<CalendarioProps> = ({ selectedDate, setSelectedDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={selectedDate ? dayjs(selectedDate) : null}
        onChange={(date) => setSelectedDate(date ? date.format('YYYY-MM-DD') : '')}
      />
    </LocalizationProvider>
  );
};

export default Calendario;