import React, { useState, useEffect } from "react";
import Card from "../../components/Card.tsx";
import AppBar from "../../components/common/AppBar.tsx";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Grid from "@mui/material/Grid";
import axios from "axios";

interface CardItem {
  id: string;
  chartType: "Barra" | "Linea" | "Dona";
  title: string;
  devUI: string;
}

interface Column {
  id: string;
  items: CardItem[];
}

function Home() {
  const [columns, setColumns] = useState<{ [key: string]: Column }>({
    left: { id: "left", items: [] },
    right: { id: "right", items: [] },
  });

  useEffect(() => {
    // Obtener dispositivos desde la API
    axios.get("http://localhost:8800/dispositivos")
      .then((response) => {
        const devices = response.data.data;

        // Generar gráficos para cada devUI
        const allCards: CardItem[] = devices.flatMap((device, index) => [
          { id: `${device.dev_ui}-barra`, chartType: "Barra", title: `Barra - ${device.nombre}`, devUI: device.dev_ui },
          { id: `${device.dev_ui}-linea`, chartType: "Linea", title: `Línea - ${device.nombre}`, devUI: device.dev_ui },
          { id: `${device.dev_ui}-dona`, chartType: "Dona", title: `Dona - ${device.nombre}`, devUI: device.dev_ui },
        ]);

        // Distribuir de forma equitativa entre las columnas
        const mid = Math.ceil(allCards.length / 2);
        setColumns({
          left: { id: "left", items: allCards.slice(0, mid) },
          right: { id: "right", items: allCards.slice(mid) },
        });
      })
      .catch((error) => console.error("Error al obtener dispositivos:", error));
  }, []);

  // Manejo del drag and drop
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = Array.from(sourceColumn.items);
    const destItems = Array.from(destColumn.items);

    const [movedItem] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, movedItem);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, items: sourceItems },
      [destination.droppableId]: { ...destColumn, items: destItems },
    });
  };

  return (
    <AppBar>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2}>
          {Object.entries(columns).map(([columnId, column]) => (
            <Grid key={columnId} item xs={12} sm={6}>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ background: "#FFF", padding: "8px", borderRadius: "4px" }}
                  >
                    {column.items.map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ margin: "0 0 8px 0", ...provided.draggableProps.style }}
                          >
                            <Card chartType={card.chartType} title={card.title} threshold={5} data={[]} devUI={card.devUI} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
    </AppBar>
  );
}

export default Home;
