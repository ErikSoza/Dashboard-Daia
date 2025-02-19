import * as React from 'react';
import { format } from 'date-fns';
import { Data } from '../models/models';
import Button from './common/Button.tsx';
import { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import Calendario from './common/Calendario.tsx';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { usePulseData } from "../hooks/usePulseData.tsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

interface Props {
  type: "Barra" | "Linea" | "Dona";
  threshold?: number;
  filterType?: "hora" | "dia"; 
  selectedDate?: string; 
  showControls?: boolean; 
}

const Grafico: React.FC<Props> = ({ type, threshold = 0, filterType: initialFilterType = "dia", selectedDate: initialSelectedDate = "", showControls = true }) => {
  const { pulseData, loading, error } = usePulseData();

  const [selectedDate, setSelectedDate] = useState<string>(initialSelectedDate);
  const [filterType, setFilterType] = useState<"hora" | "dia">(initialFilterType);
  const [selectedStartDate, setSelectedStartDate] = useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = useState<string>("");
  const [chartSize, setChartSize] = useState({ width: window.innerWidth * 0.7, height: window.innerHeight * 0.6 });
  const [thresholdState, setThreshold] = useState<number>(threshold);
  const [alertSignal, setAlertSignal] = useState<boolean>(false);
  
  let groupedData: { time: string; count: number; fueraDeTurno: boolean }[] = [];
  
  const errores = groupedData.filter(d => d.count < thresholdState && !d.fueraDeTurno).length;
  const normales = groupedData.filter(d => d.count >= thresholdState && !d.fueraDeTurno).length;
  const fueraDeTurno = groupedData.filter(d => d.fueraDeTurno).length;

  useEffect(() => {
    const handleResize = () => {
      setChartSize({ width: window.innerWidth * 0.7, height: window.innerHeight * 0.6 });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      setSelectedDate("");
    }
  }, [selectedStartDate, selectedEndDate]);

  useEffect(() => {
    if (errores > 5) {
      setAlertSignal(true);
      alert("¡Se detectaron más de 5 errores!");
    } else {
      setAlertSignal(false);
    }
  }, [errores]);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;

  const validData = pulseData.filter(d => d.time && !isNaN(new Date(d.time).getTime()));
  
  const sortedData: Data[] = [...validData].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  let filteredData = sortedData;
  if (selectedDate) {
    filteredData = sortedData.filter(d => format(d.time, "yyyy-MM-dd") === selectedDate);
  } else if (selectedStartDate && selectedEndDate) {
    filteredData = sortedData.filter(d => {
      const date = format(d.time, "yyyy-MM-dd");
      return date >= selectedStartDate && date <= selectedEndDate;
    });
  }

  if (filterType === "hora") {
    const hourlyMap = new Map<string, { count: number; fueraDeTurno: boolean }>();
    filteredData.forEach((d) => {
      const hour = format(d.time, "HH:00");
      const currentCount = hourlyMap.get(hour)?.count || 0;
      hourlyMap.set(hour, { count: currentCount + (d.count ?? 0), fueraDeTurno: currentCount + (d.count ?? 0) === 0 });
    });
    groupedData = Array.from(hourlyMap.entries()).map(([time, { count, fueraDeTurno }]) => ({ time, count, fueraDeTurno }));
  } 
  else if (filterType === "dia") {
    const dailyMap = new Map<string, { count: number; fueraDeTurno: boolean }>();
    filteredData.forEach((d) => {
      const day = format(d.time, "yyyy-MM-dd");
      const currentCount = dailyMap.get(day)?.count || 0;
      dailyMap.set(day, { count: currentCount + (d.count ?? 0), fueraDeTurno: currentCount + (d.count ?? 0) === 0 });
    });
    groupedData = Array.from(dailyMap.entries()).map(([time, { count, fueraDeTurno }]) => ({ time, count, fueraDeTurno }));
  }


  const chartData = {
    labels: groupedData.map(d => d.time),
    datasets: [{
      label: 'Count',
      data: groupedData.map(d => d.count),
      backgroundColor: groupedData.map(d => d.fueraDeTurno ? 'rgba(255, 206, 86, 0.2)' : d.count < thresholdState ? 'rgba(255, 99, 132, 0.2)' : 'rgba(75, 192, 192, 0.2)'),
      borderColor: groupedData.map(d => d.fueraDeTurno ? 'rgba(255, 206, 86, 1)' : d.count < thresholdState ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)'), 
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      {alertSignal && <div style={{ color: 'red', fontWeight: 'bold' }}>¡Se detectaron más de 5 errores!</div>}
      <div style={{ width: chartSize.width, height: chartSize.height }}>
        {type === "Barra" ? (
          <Bar data={chartData} options={chartOptions} />
        ) : type === "Linea" ? (
          <Line data={chartData} options={chartOptions} />
        ) : type === "Dona" ?(
          <Doughnut data={chartData} options={chartOptions} />
        ) : null}
      </div>

      {showControls && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '0.8em', gap: '0.5em' }}>
          <div>Minimo de error</div>
          <input type="number" value={thresholdState} onChange={(e) => setThreshold(Number(e.target.value))} placeholder="Set threshold" disabled={threshold !== 0} style={{ width: '80px' }} />
          <div>Valores correctos: {normales} - Fuera de turno: {fueraDeTurno}</div>
          <div>Errores: {errores}</div>
          <Calendario selectedStartDate={selectedStartDate} setSelectedStartDate={(date) => { setSelectedStartDate(date); setSelectedDate(""); setFilterType("dia"); }} 
          selectedEndDate={selectedEndDate} setSelectedEndDate={(date) => { setSelectedEndDate(date); setSelectedDate(""); setFilterType("dia"); }} 
          selectedDate={selectedDate} setSelectedDate={(date) => { setSelectedDate(date); setFilterType("hora"); }}/>
          <Button onClick={() => { setSelectedStartDate(""); setSelectedEndDate(""); setSelectedDate(""); setFilterType("dia"); }}>Limpiar Filtro</Button>
        </div>
      )}
    </div>
  );
};
  
export default Grafico;
