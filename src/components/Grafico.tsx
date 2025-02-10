import * as React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Data } from '../models/models';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { useState } from 'react';
import { format } from 'date-fns';
import Calendario from './common/Calendario.tsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

interface Props {
  data: Data[];
  type: "Barra" | "Linea" | "Dona";
}

const Grafico: React.FC<Props> = ({ data, type }) => {
  const [filterType, setFilterType] = useState<"hora" | "dia">("hora");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Ordenar datos cronológicamente
  const sortedData: Data[] = [...data].sort((a, b) => a.time.getTime() - b.time.getTime());

  // Filtrar por fecha seleccionada
  let filteredData = sortedData;
  if (selectedDate) {
    filteredData = sortedData.filter(d => format(d.time, "yyyy-MM-dd") === selectedDate);
  }

  // Agrupar datos según el intervalo seleccionado
  let groupedData: { time: string; count: number }[] = [];

  if (filterType === "hora") {
    const hourlyMap = new Map<string, number>();

    filteredData.forEach((d) => {
      const hour = format(d.time, "yyyy-MM-dd HH:00");
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + (d.count ?? 0));
    });

    groupedData = Array.from(hourlyMap.entries()).map(([time, count]) => ({ time, count }));
  } else if (filterType === "dia") {
    const dailyMap = new Map<string, number>();

    filteredData.forEach((d) => {
      const day = format(d.time, "yyyy-MM-dd");
      dailyMap.set(day, (dailyMap.get(day) || 0) + (d.count ?? 0));
    });

    groupedData = Array.from(dailyMap.entries()).map(([time, count]) => ({ time, count }));
  }

  const chartData = {
    labels: groupedData.map(d => d.time),
    datasets: [{
      label: 'Count',
      data: groupedData.map(d => d.count),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}> 
        <div>
          <Calendario selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          <button onClick={() => setFilterType("hora")}>Conteo/Hora</button>
          <button onClick={() => setFilterType("dia")}>Conteo/Dia</button>
          <button onClick={() => setSelectedDate("")}>Limpiar Filtro</button>
        </div>

        {type === "Barra" ? (
          <Bar data={chartData} />
        ) : type === "Linea" ? (
          <Line data={chartData} />
        ) : (
          <Doughnut data={chartData} />
        )}
      </div>
    </div>
  );
};

export default Grafico;
