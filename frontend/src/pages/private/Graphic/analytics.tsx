import React from "react";
import Grafico from "../../../components/Grafico.tsx";
import AppBar from "../../../components/common/AppBar.tsx";
import Tabla from "../../../components/common/Tabla.tsx"
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

function Analytics() {
    const location = useLocation();
    const { chartType, devUI, threshold, title } = location.state || {};
    
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
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              <h1>{title}</h1>
            </Typography>
            <Grafico type={chartType} devUI={devUI} threshold={threshold}/>
        </Box>
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column", 
            }}
        >
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              <h1>Tabla de datos</h1>
            </Typography>
            <Tabla devUI={devUI}/>
        </Box>
    </AppBar>
);
}

export default Analytics;
