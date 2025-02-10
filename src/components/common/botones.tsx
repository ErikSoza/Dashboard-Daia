import * as React from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

interface BotonesProps {
  chartType: "Barra" | "Linea" | "Dona";
  setChartType: (type: "Barra" | "Linea" | "Dona") => void;
}

const Botones: React.FC<BotonesProps> = ({ chartType, setChartType }) => {
  return (
    <ButtonGroup disableElevation variant="contained" aria-label="Tipo de gráfico">
      <Button 
        variant={chartType === "Barra" ? "contained" : "outlined"} 
        onClick={() => setChartType("Barra")}
      >
        Barras
      </Button>
      <Button 
        variant={chartType === "Linea" ? "contained" : "outlined"} 
        onClick={() => setChartType("Linea")}
      >
        Líneas
      </Button>
      <Button 
        variant={chartType === "Dona" ? "contained" : "outlined"} 
        onClick={() => setChartType("Dona")}
      >
        Dona
      </Button>
    </ButtonGroup>
  );
}

export default Botones;
