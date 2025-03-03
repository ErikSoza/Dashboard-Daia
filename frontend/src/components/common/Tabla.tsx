import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { usePulseData } from "../../hooks/usePulseData.tsx";

const columns = [
  { id: "time", label: "Tiempo", minWidth: 170 },
  { id: "pulse", label: "Pulso", minWidth: 100 },
  { id: "battery", label: "Bateria", minWidth: 100 },
  { id: "humidity", label: "Humedad", minWidth: 100 },
  { id: "temperature", label: "Temperatura", minWidth: 100 },
  { id: "difference", label: "Diferencia", minWidth: 100 },
  { id: "count", label: "Count", minWidth: 100 },
];

const PulseDataTable = ({ devUI }) => {
  const { pulseData, loading, error } = usePulseData();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterDate, setFilterDate] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const rows = pulseData[devUI] || [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterDate(event.target.value);
  };

  const filteredRows = rows.filter((row) => {
    if (!filterDate) return true;
    const rowDate = new Date(row.time).toLocaleDateString('en-CA'); // 'en-CA' for YYYY-MM-DD format
    return rowDate === filterDate;
  });

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TextField
        label="Filtrar por fecha"
        type="date"
        value={filterDate}
        onChange={handleFilterChange}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ marginBottom: 2 }}
      />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="pulse data table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.id === "time" && row[column.id] instanceof Date
                      ? row[column.id].toLocaleString()
                      : row[column.id]}
                  </TableCell>
                ))}
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
};

export default PulseDataTable;
