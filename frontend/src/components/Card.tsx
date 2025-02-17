import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grafico from './Grafico.tsx';
import { Data } from '../models/models';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface CardProps {
  data: Data[];
  chartType: "Barra" | "Linea" | "Dona";
  title: string;
  threshold: number; // New prop for threshold
}

const OutlinedCard: React.FC<CardProps> = ({ data, chartType, title, threshold }) => {
  const [chartTypeState] = useState<"Barra" | "Linea" | "Dona">(chartType);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box sx={{ minWidth: 275, margin: '20px' }}>
      <Card variant="outlined" sx={{ boxShadow: 3 }}>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              {title}
            </Typography>
            <IconButton onClick={handleExpandClick}>
              <ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </IconButton>
          </div>
          {expanded && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Grafico data={data} type={chartTypeState} threshold={threshold} /> {/* Pass threshold to Grafico */}
            </div>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default OutlinedCard;
