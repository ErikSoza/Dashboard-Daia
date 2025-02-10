import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grafico from './Grafico.tsx';
import Botones from './common/botones.tsx';
import { Data } from '../models/models';

interface CardProps {
  data: Data[];
}

const OutlinedCard: React.FC<CardProps> = ({ data }) => {
  const [chartType, setChartType] = useState<"Barra" | "Linea" | "Dona">("Barra");

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            Gráfico de Datos
          </Typography>
          <Botones chartType={chartType} setChartType={setChartType} />
          <Grafico data={data} type={chartType} />
        </div>
        </CardContent>
      </Card>
    </Box>
  );
}

export default OutlinedCard;
