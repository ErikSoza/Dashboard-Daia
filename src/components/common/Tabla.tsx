import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { Data } from '../../models/models';

interface TablaProps {
  rows: Data[];
}

export default function Tabla({ rows }: TablaProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [devUIFilter, setDevUIFilter] = React.useState('');
  const [timeFilter, setTimeFilter] = React.useState('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredRows = rows.filter(row => 
    (devUIFilter === '' || row.DevUI.includes(devUIFilter)) &&
    (timeFilter === '' || row.time.toLocaleString().includes(timeFilter))
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
      <TextField
        label="Filtrar por DevUI"
        variant="outlined"
        size="small"
        value={devUIFilter}
        onChange={(e) => setDevUIFilter(e.target.value)}
        sx={{ marginRight: 2 }}
      />
      <TextField
        label="Filtrar por Tiempo (DD/MM/YYYY)"
        variant="outlined"
        size="small"
        value={timeFilter}
        onChange={(e) => setTimeFilter(e.target.value)}
      />
      <TableContainer sx={{ maxHeight: 440, marginTop: 2 }}>
        <Table stickyHeader aria-label="filtered table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Pulso</TableCell>
              <TableCell align="right">DevUI</TableCell>
              <TableCell align="right">Humedad</TableCell>
              <TableCell align="right">Temperatura</TableCell>
              <TableCell align="right">Batería</TableCell>
              <TableCell align="right">Tiempo</TableCell>
              <TableCell align="right">Diferencia</TableCell>
              <TableCell align="right">Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell align="right">{row.pulse}</TableCell>
                <TableCell align="right">{row.DevUI}</TableCell>
                <TableCell align="right">{row.humidity}</TableCell>
                <TableCell align="right">{row.temperature}</TableCell>
                <TableCell align="right">{row.battery}</TableCell>
                <TableCell align="right">{row.time.toLocaleString()}</TableCell>
                <TableCell align="right">{row.difference}</TableCell>
                <TableCell align="right">{row.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
