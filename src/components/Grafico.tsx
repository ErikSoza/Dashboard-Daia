import * as React from 'react';
import { format } from 'date-fns';
import { Data } from '../models/models';
import Button from './common/Button.tsx';
import { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import Calendario from './common/Calendario.tsx';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

interface Props {
  data: Data[];
  type: "Barra" | "Linea" | "Dona";
}

const Grafico: React.FC<Props> = ({ data, type }) => {
  const [filterType, setFilterType] = useState<"hora" | "dia">("dia"); // "hora" | "dia" es una unión de tipos que acepta solo "hora" o "dia"
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [chartSize, setChartSize] = useState({ width: window.innerWidth * 0.7, height: window.innerHeight * 0.6 }); // window.innerWidth y window.innerHeight son las dimensiones del navegador

  useEffect(() => {
    const handleResize = () => {
      setChartSize({ width: window.innerWidth * 0.7, height: window.innerHeight * 0.6 });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Este return es una función que se ejecuta cuando el componente se desmonta
  }, []);

  const sortedData: Data[] = [...data].sort((a, b) => a.time.getTime() - b.time.getTime()); 

  let filteredData = sortedData; 
  if (selectedDate) {
    filteredData = sortedData.filter(d => format(d.time, "yyyy-MM-dd") === selectedDate); 
  }

  let groupedData: { time: string; count: number }[] = [];

  if (filterType === "hora") { // Si el filtro es por hora
    const hourlyMap = new Map<string, number>();
    filteredData.forEach((d) => {
      const hour = format(d.time, "HH:00");
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + (d.count ?? 0));
    });
    groupedData = Array.from(hourlyMap.entries()).map(([time, count]) => ({ time, count }));
  } else if (filterType === "dia") { // Si el filtro es por día
    const dailyMap = new Map<string, number>();
    filteredData.forEach((d) => {
      const day = format(d.time, "yyyy-MM-dd");
      dailyMap.set(day, (dailyMap.get(day) || 0) + (d.count ?? 0));
    });
    groupedData = Array.from(dailyMap.entries()).map(([time, count]) => ({ time, count })); 
  }

  const chartData = { // Este es el objeto de datos que se pasa al componente de gráfico
    labels: groupedData.map(d => d.time),
    datasets: [{
      label: 'Count',
      data: groupedData.map(d => d.count),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <div style={{ width: chartSize.width, height: chartSize.height }}>
        {type === "Barra" ? (
          <Bar data={chartData} options={chartOptions} />
        ) : type === "Linea" ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Doughnut data={chartData} options={chartOptions} />
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <Calendario selectedDate={selectedDate} setSelectedDate={(date) => { setSelectedDate(date); setFilterType("hora"); }} />
        <Button onClick={() => { setSelectedDate(""); setFilterType("dia"); }}>Limpiar Filtro</Button>
      </div>
    </div>    
  );
};

export default Grafico;
