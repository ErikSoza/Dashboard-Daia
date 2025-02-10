import React, { useEffect, useState } from "react";
import Layout from "../../components/common/layout.tsx";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Grafico from "../../components/Grafico.tsx";
import Botones from "../../components/common/botones.tsx";
import Tabla from "../../components/common/Tabla.tsx";
import Card from "../../components/Card.tsx";
import { Data } from "../../models/models.tsx";

// Importar dinámicamente todos los archivos JSON en utils
const requireJson = (require as any).context("../../utils", false, /\.json$/);
const jsonData = requireJson.keys().map((file) => requireJson(file));

function Home() {
  const [pulseData, setPulseData] = useState<Data[]>([]);
  const [chartType, setChartType] = useState<"Barra" | "Linea" | "Dona">("Barra");

  useEffect(() => {
    let lastPulse = 0;
    let count = 0;
  
    const extractedData = jsonData.flatMap((sensorData) =>
      sensorData
        .filter((entry: any) => entry.uplink_message?.decoded_payload) // Filtra los que tienen datos válidos
        .map((entry: any, index: number) => {
          const { uplink_message, end_device_ids } = entry;
  
          const difference =
            lastPulse === 0 ? 0 : uplink_message.decoded_payload.pulse - lastPulse;
          lastPulse = uplink_message.decoded_payload.pulse;
  
          count = difference !== 0 ? 1 : 0;
  
          return {
            id: index + 1,
            pulse: uplink_message.decoded_payload.pulse,
            DevUI: end_device_ids?.dev_eui ?? "N/A", // Evita errores si no existe `dev_eui`
            battery: uplink_message.decoded_payload.battery ?? "N/A",
            humidity: uplink_message.decoded_payload.humidity ?? "N/A",
            temperature: uplink_message.decoded_payload.temperature ?? "N/A",
            time: uplink_message.rx_metadata?.[0]?.time
              ? new Date(uplink_message.rx_metadata[0].time)
              : "Fecha desconocida",
            difference,
            count,
          };
        })
    );
  
    setPulseData(extractedData);
  }, []);

  return (
    <Layout>
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <div style={{ textAlign: "center" }}>
          <Botones chartType={chartType} setChartType={setChartType} />
          <Grafico data={pulseData} type={chartType} />
        </div>
      </TableContainer>
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h4>Tabla de Datos</h4>
          <Tabla rows={pulseData} />
        </div>
      </TableContainer>
      <Card data={pulseData} />
    </Layout>
  );
}

export default Home;
