import React, { useState } from "react";
import Card from "../../components/Card.tsx";
import Grafico from "../../components/Grafico.tsx";
import Tabla from "../../components/common/Tabla.tsx";
import Layout from "../../components/common/layout.tsx";
import Botones from "../../components/common/botones.tsx";
import { usePulseData } from "../../hooks/usePulseData.tsx";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";

function Home() {
  const pulseData = usePulseData();
  const [chartType, setChartType] = useState<"Barra" | "Linea" | "Dona">("Barra");

  return (
    <Layout>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Botones chartType={chartType} setChartType={setChartType} />
        <Grafico data={pulseData} type={chartType} />
      </div>
        
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h4>Tabla de Datos</h4>
          <Tabla rows={pulseData} />
        </div>
      </TableContainer>
      
      <Card data={pulseData} />
    </Layout>
  );
}

export default Home;
