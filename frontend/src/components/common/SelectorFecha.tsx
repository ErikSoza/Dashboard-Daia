import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface SelectorFechaProps {
  label: string;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const SelectorFecha: React.FC<SelectorFechaProps> = ({ label, selectedDate, setSelectedDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={selectedDate ? dayjs(selectedDate) : null}
        onChange={(date) => setSelectedDate(date ? date.format('YYYY-MM-DD') : '')}
        slotProps={{
          textField: {
            sx: { width: '150px', '.MuiInputBase-input': { fontSize: '0.8em' }, '.MuiInputLabel-root': { fontSize: '0.8em' } }
          }
        }}
      />
    </LocalizationProvider>
  );
};

export default SelectorFecha;
