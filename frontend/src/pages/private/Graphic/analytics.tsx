import React, { useState } from "react";
import Grafico from "../../../components/Grafico.tsx";
import AppBar from "../../../components/common/AppBar.tsx";
import Botones from "../../../components/common/botones.tsx";
//import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";

function Analytics() {
  const [chartType, setChartType] = useState<"Barra" | "Linea" | "Dona">("Barra");
  return (
    <AppBar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Botones chartType={chartType} setChartType={setChartType} />
        <Grafico type={chartType} />
      </Box>
    </AppBar>
  );
}

export default Analytics;
