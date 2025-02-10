import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Data } from '../../models/models';


interface TablaProps {
    rows: Data[];
}

function Tabla({ rows }: TablaProps) {
  return (
    <Table sx={{ maxWidth: 150, alignItems: 'center'}} aria-label="simple table">
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
        {rows.map((row) => (
        <TableRow
          key={row.id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {row.id}
          </TableCell>
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
  );
}

export default Tabla;