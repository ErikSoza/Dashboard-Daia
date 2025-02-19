import React, { useState } from "react";
import Card from "../../components/Card.tsx";
//import Grafico from "../../components/Grafico.tsx";
import AppBar from "../../components/common/AppBar.tsx";
//import Botones from "../../components/common/botones.tsx";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Grid from "@mui/material/Grid";
//import { Box } from "@mui/material";

interface CardItem {
  id: string;
  chartType: "Barra" | "Linea" | "Dona";
  title: string;
}

interface Column {
  id: string;
  items: CardItem[];
}

function Home() {
  // Estado con dos columnas: left y right
  const [columns, setColumns] = useState<{ [key: string]: Column }>({
    left: {
      id: "left",
      items: [
        { id: "1", chartType: "Linea", title: "Grafico de Linea Andinexia" },
        { id: "2", chartType: "Barra", title: "Grafico de Barra Andinexia" },
      ],
    },
    right: {
      id: "right",
      items: [
        { id: "3", chartType: "Dona", title: "Grafico de Dona Andinexia" },
      ],
    },
  });

  //const [chartType, setChartType] = useState<"Barra" | "Linea" | "Dona">("Barra");

  // Manejo del drag and drop
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Si no hay destino, no hacemos nada
    if (!destination) return;

    // Si se soltó en la misma posición, no hacemos nada
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Clonamos los arrays de cada columna
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = Array.from(sourceColumn.items);
    const destItems = Array.from(destColumn.items);

    // Extraemos el item de la columna de origen
    const [movedItem] = sourceItems.splice(source.index, 1);

    // Insertamos el item en la columna destino en la posición indicada
    destItems.splice(destination.index, 0, movedItem);

    // Actualizamos el estado
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  };

  return (
    <AppBar>
    {/*
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
          */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container>
          {Object.entries(columns).map(([columnId, column]) => (
            <Grid key={columnId} item xs={12} sm={6}>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      background: "#FFF",
                      padding: "8px",
                      borderRadius: "4px",
                    }}
                  >
                    {column.items.map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              margin: "0 0 8px 0",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <Card chartType={card.chartType} title={card.title} threshold={5} data={[]}/>
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
