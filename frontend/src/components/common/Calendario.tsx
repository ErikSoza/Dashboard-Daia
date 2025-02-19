import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import SelectorFecha from './SelectorFecha.tsx';

interface CalendarioProps {
  selectedStartDate: string;
  setSelectedStartDate: (date: string) => void;
  selectedEndDate: string;
  setSelectedEndDate: (date: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const Calendario: React.FC<CalendarioProps> = ({ selectedStartDate, setSelectedStartDate, selectedEndDate, setSelectedEndDate, selectedDate, setSelectedDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', maxWidth: '600px' }}>
        <DateCalendar
          value={selectedDate ? dayjs(selectedDate) : null}
          onChange={(date) => setSelectedDate(date ? date.format('YYYY-MM-DD') : '')}
          sx={{ '.MuiPickersCalendarHeader-root': { fontSize: '0.8em' }, '.MuiDayPicker-weekDayLabel': { fontSize: '0.7em' }, '.MuiPickersDay-root': { fontSize: '0.8em' } }}
        />
        <div style={{ display: 'flex', gap: '1em' }}>
          <SelectorFecha
            label="Start Date"
            selectedDate={selectedStartDate}
            setSelectedDate={setSelectedStartDate}
          />
          <SelectorFecha
            label="End Date"
            selectedDate={selectedEndDate}
            setSelectedDate={setSelectedEndDate}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default Calendario;