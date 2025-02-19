import React, { useState } from "react";
import Card from "../../components/Card.tsx";
import Grafico from "../../components/Grafico.tsx";
//import Tabla from "../../components/common/Tabla.tsx";
import AppBar from "../../components/common/AppBar.tsx";
import Botones from "../../components/common/botones.tsx";
//import Paper from "@mui/material/Paper";
//import TableContainer from "@mui/material/TableContainer";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function Home() {
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

  return (
    <AppBar>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Botones chartType={chartType} setChartType={setChartType} />
        <Grafico type={chartType} />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="cards-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <Card chartType={card.chartType} title={card.title} threshold={5} data={[]} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </AppBar>
  );
}

export default Home;
