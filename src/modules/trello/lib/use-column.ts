import { useEffect, useState } from "react";
import { Card, Column } from "../model/types";

const API_BASE_URL = "http://localhost:3001";

export const useColumn = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [columnSearchQueries, setColumnSearchQueries] = useState<
    Record<string, string>
  >({});
    const [columns, setColumns] = useState<Column[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
  const [draggedColumn, setDraggedColumn] = useState<Column | null>(null);
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);



  useEffect(() => {
    fetchColumns();
    fetchCards();
  }, []);



  const fetchColumns = async () => {
    const response = await fetch(`${API_BASE_URL}/columns`);
    const data = await response.json();
    setColumns(data);
  };

  const fetchCards = async () => {
    const response = await fetch(`${API_BASE_URL}/cards`);
    const data = await response.json();
    setCards(data);
  };

  const createColumn = async (title: string) => {
    const newColumn = {
      id: crypto.randomUUID(),
      title,
      order: columns.length,
    };

    await fetch(`${API_BASE_URL}/columns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newColumn),
    });

    setColumns([...columns, newColumn]);
  };

  const updateColumn = async (id: string, title: string, order: number) => {
    const response = await fetch(`${API_BASE_URL}/columns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, order }),
    });
    const updatedColumn = await response.json();
    setColumns(columns.map((col) => (col.id === id ? updatedColumn : col)));
  };

  const deleteColumn = async (id: string) => {
    await fetch(`${API_BASE_URL}/columns/${id}`, { method: "DELETE" });
    setColumns(columns.filter((col) => col.id !== id));
    setCards(
      cards.map((card) =>
        card.columnId === id ? { ...card, columnId: null } : card,
      ),
    );
  };

  const createCard = async (
    columnId: string,
    title: string,
    description: string,
  ) => {
    const newCard = {
      id: crypto.randomUUID(),
      columnId,
      title,
      description,
      order: cards.filter((card) => card.columnId === columnId).length,
    };

    await fetch(`${API_BASE_URL}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCard),
    });

    setCards([...cards, newCard]);
  };

  const updateCard = async (
    id: string,
    title: string,
    description: string,
    columnId: string | null,
    order: number,
  ) => {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, columnId, order }),
    });
    const updatedCard = await response.json();
    setCards(cards.map((card) => (card.id === id ? updatedCard : card)));
  };

  const deleteCard = async (id: string) => {
    await fetch(`${API_BASE_URL}/cards/${id}`, { method: "DELETE" });
    setCards(cards.filter((card) => card.id !== id));
  };

  const sortByOrder = <T extends { order: number }>(items: T[]): T[] => {
    return [...items].sort((a, b) => a.order - b.order);
  };

  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedColumns = sortByOrder(columns);

  const getColumnCards = (columnId: string) => {
    const columnSearch = columnSearchQueries[columnId]?.toLowerCase() || "";
    return sortByOrder(
      filteredCards.filter(
        (card) =>
          card.columnId === columnId &&
          (columnSearch === "" ||
            card.title.toLowerCase().includes(columnSearch) ||
            card.description.toLowerCase().includes(columnSearch)),
      ),
    );
  };

  const handleColumnDragStart = (e: React.DragEvent, column: Column) => {
    e.stopPropagation();
    setDraggedColumn(column);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleColumnDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedColumn && draggedColumn.id !== columnId) {
      setDragOverColumnId(columnId);
    }
  };

  const handleColumnDrop = async (
    e: React.DragEvent,
    targetColumnId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedColumn || draggedColumn.id === targetColumnId) {
      setDraggedColumn(null);
      setDragOverColumnId(null);
      return;
    }

    const sourceIndex = columns.findIndex((col) => col.id === draggedColumn.id);
    const targetIndex = columns.findIndex((col) => col.id === targetColumnId);

    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(sourceIndex, 1);
    newColumns.splice(targetIndex, 0, movedColumn);

    // Update orders
    const updatedColumns = newColumns.map((col, index) => ({
      ...col,
      order: index,
    }));

    setColumns(updatedColumns);
    setDraggedColumn(null);
    setDragOverColumnId(null);

    // Update all columns in the backend
    await Promise.all(
      updatedColumns.map((col) =>
        fetch(`${API_BASE_URL}/columns/${col.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: col.order }),
        }),
      ),
    );
  };

  const handleCardDragStart = (e: React.DragEvent, card: Card) => {
    e.stopPropagation();
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleCardDragOver = (
    e: React.DragEvent,

    cardId?: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedCard) {
      if (cardId && draggedCard.id !== cardId) {
        setDragOverCardId(cardId);
      }
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleCardDrop = async (
    e: React.DragEvent,
    targetColumnId: string,
    targetCardId?: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedCard) {
      setDragOverCardId(null);
      return;
    }

    // If dropping on the same card, do nothing
    if (targetCardId === draggedCard.id) {
      setDragOverCardId(null);
      return;
    }

    // If dropping in the same column and position, do nothing
    if (
      targetColumnId === draggedCard.columnId &&
      targetCardId === draggedCard.id
    ) {
      setDragOverCardId(null);
      return;
    }

    const targetCards = cards.filter(
      (card) => card.columnId === targetColumnId,
    );
    let newOrder: number;

    if (targetCardId) {
      const targetCard = cards.find((card) => card.id === targetCardId);
      if (targetCard) {
        newOrder = targetCard.order;
        // Update orders of other cards in the column
        await Promise.all(
          cards
            .filter(
              (card) =>
                card.columnId === targetColumnId &&
                card.order >= newOrder &&
                card.id !== draggedCard.id,
            )
            .map((card) =>
              updateCard(
                card.id,
                card.title,
                card.description,
                card.columnId,
                card.order + 1,
              ),
            ),
        );
      } else {
        newOrder = targetCards.length;
      }
    } else {
      // When dropping in an empty column or at the end of a column
      newOrder = targetCards.length;
    }

    // Update the dragged card
    await updateCard(
      draggedCard.id,
      draggedCard.title,
      draggedCard.description,
      targetColumnId,
      newOrder,
    );

    // Update local state
    setCards((prevCards) => {
      const updatedCards = prevCards.map((card) => {
        if (card.id === draggedCard.id) {
          return { ...card, columnId: targetColumnId, order: newOrder };
        }
        if (
          card.columnId === targetColumnId &&
          card.order >= newOrder &&
          card.id !== draggedCard.id
        ) {
          return { ...card, order: card.order + 1 };
        }
        return card;
      });
      return updatedCards;
    });

    setDraggedCard(null);
    setDragOverCardId(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDraggedCard(null);
    setDragOverColumnId(null);
    setDragOverCardId(null);
  };


    
   return {
    searchQuery,
    setSearchQuery,
    columns,
    cards,
    draggedColumn,
    draggedCard,
    dragOverColumnId,
    dragOverCardId,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop,
    handleCardDragStart,
    handleCardDragOver,
    handleCardDrop,
    handleDragEnd,
    getColumnCards,
    sortedColumns,
    filteredCards,
    createColumn,
    updateColumn,
    deleteColumn,
    createCard,
    updateCard,
    deleteCard, 
    sortByOrder,
    columnSearchQueries,
    setColumnSearchQueries,
   }
}