import React, { useState } from "react";
import Card from "../../components/Card.tsx";
import Grafico from "../../components/Grafico.tsx";
import Tabla from "../../components/common/Tabla.tsx";
import Layout from "../../components/common/layout.tsx";
import Botones from "../../components/common/botones.tsx";
import { usePulseData } from "../../hooks/usePulseData.tsx";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function Home() {
  const { pulseData, loading, error } = usePulseData();
  const [chartType, setChartType] = useState<"Barra" | "Linea" | "Dona">("Barra");

  const [cards, setCards] = useState<{ id: string; chartType: "Barra" | "Linea" | "Dona"; title: string; }[]>([
    { id: "1", chartType: "Linea", title: "Grafico de Linea Andinexia" },
    { id: "2", chartType: "Barra", title: "Grafico de Barra Andinexia" },
    { id: "3", chartType: "Dona", title: "Grafico de Dona Andinexia" },
  ]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const reorderedCards = Array.from(cards);
    const [movedCard] = reorderedCards.splice(result.source.index, 1);
    reorderedCards.splice(result.destination.index, 0, movedCard);
    
    setCards(reorderedCards);
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Layout>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="cards-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <Card data={pulseData} chartType={card.chartType} title={card.title} threshold={5} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
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

    </Layout>
  );
}

export default Home;
