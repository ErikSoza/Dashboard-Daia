import React from "react";
import Grafico from "../../../components/Grafico.tsx";
import AppBar from "../../../components/common/AppBar.tsx";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

function Analytics() {
const { chartType } = useParams<{ chartType: "Barra" | "Linea" | "Dona" }>();
const chartTypeState = chartType || "Barra";

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
            <Grafico type={chartTypeState} devUI="24E124136C482304" />
        </Box>
    </AppBar>
);
}

export default Analytics;
