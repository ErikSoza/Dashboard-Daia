import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grafico from './Grafico.tsx';
import { Data } from '../models/models';
import Button from './common/Button.tsx';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  data: Data[];
  chartType: "Barra" | "Linea" | "Dona";
  title: string;
  threshold: number;
  devUI: string;
}

const OutlinedCard: React.FC<CardProps> = ({chartType, title, threshold, devUI }) => {
  const [chartTypeState] = useState<"Barra" | "Linea" | "Dona">(chartType);
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  //const today = "2025-02-08"; //ejemplo en caso de que no hayan datos en la base de datos
  
  return (
    <Box sx={{ minWidth: 275, margin: '20px' }}>
      <Card variant="outlined" sx={{ boxShadow: 3 }}>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              {title} {today}
            </Typography>
          </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Grafico type={chartTypeState} threshold={threshold} filterType="hora" selectedDate={today} showControls={false} /> 
                <Button onClick={() => navigate(`/analytics/${chartTypeState}/${devUI}`, { state: { chartType: chartTypeState, devUI, threshold, title } })}>Más detalles</Button>
            </div>
        </CardContent>
      </Card>
    </Box>
  );
}

export default OutlinedCard;
