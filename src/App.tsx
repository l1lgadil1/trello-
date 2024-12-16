import { useState, useEffect } from "react";

interface Card {
  id: string;
  columnId: string | null;
  title: string;
  description: string;
  order: number;
}

interface Column {
  id: string;
  title: string;
  order: number;
}

const API_BASE_URL = "http://localhost:3001";

const DragHandle = () => (
  <svg
    className="w-4 h-4 text-gray-400 cursor-move"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 8h16M4 16h16"
    />
  </svg>
);

function App() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [columnSearchQueries, setColumnSearchQueries] = useState<
    Record<string, string>
  >({});
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [showUnassigned, setShowUnassigned] = useState(() => {
    const saved = localStorage.getItem("showUnassigned");
    return saved ? JSON.parse(saved) : false;
  });
  const [draggedColumn, setDraggedColumn] = useState<Column | null>(null);
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);
  const [columnTitle, setColumnTitle] = useState("");
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardColumnId, setCardColumnId] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("showUnassigned", JSON.stringify(showUnassigned));
  }, [showUnassigned]);

  useEffect(() => {
    fetchColumns();
    fetchCards();
  }, []);

  useEffect(() => {
    if (editingColumn) {
      setColumnTitle(editingColumn.title);
    } else {
      setColumnTitle("");
    }
  }, [editingColumn]);

  useEffect(() => {
    if (editingCard) {
      setCardTitle(editingCard.title);
      setCardDescription(editingCard.description);
      setCardColumnId(editingCard.columnId ?? "");
    } else {
      setCardTitle("");
      setCardDescription("");
      setCardColumnId(activeColumnId || "");
    }
  }, [editingCard, activeColumnId]);

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setIsColumnModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Column
            </button>
            <button
              onClick={() => setShowUnassigned(!showUnassigned)}
              className={`px-4 py-2 rounded border ${
                showUnassigned
                  ? "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {showUnassigned ? "Hide Unassigned" : "Show Unassigned"}
            </button>
          </div>
          <div className="w-64">
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto">
          {sortedColumns.map((column) => (
            <div
              key={column.id}
              draggable
              onDragStart={(e) => handleColumnDragStart(e, column)}
              onDragOver={(e) => handleColumnDragOver(e, column.id)}
              onDrop={(e) => handleColumnDrop(e, column.id)}
              onDragEnd={handleDragEnd}
              className={`bg-white rounded-lg shadow-md p-4 min-w-[300px] ${
                dragOverColumnId === column.id ? "border-2 border-blue-500" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="cursor-grab active:cursor-grabbing">
                    <DragHandle />
                  </div>
                  <h2 className="text-lg font-semibold">{column.title}</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingColumn(column);
                      setIsColumnModalOpen(true);
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteColumn(column.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search in column..."
                  value={columnSearchQueries[column.id] || ""}
                  onChange={(e) =>
                    setColumnSearchQueries((prev) => ({
                      ...prev,
                      [column.id]: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div
                className={`space-y-2 min-h-[50px] ${
                  draggedCard && getColumnCards(column.id).length === 0
                    ? "border-2 border-dashed border-gray-300 rounded-lg p-2"
                    : ""
                }`}
                onDragOver={(e) => handleCardDragOver(e, column.id)}
                onDrop={(e) => handleCardDrop(e, column.id)}
              >
                {getColumnCards(column.id).map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleCardDragStart(e, card)}
                    onDragOver={(e) => handleCardDragOver(e, card.id)}
                    onDrop={(e) => handleCardDrop(e, column.id, card.id)}
                    onDragEnd={handleDragEnd}
                    className={`bg-gray-50 p-3 rounded border border-gray-200 max-w-[300px] ${
                      draggedCard?.id === card.id ? "opacity-50" : ""
                    } ${dragOverCardId === card.id ? "border-t-4 border-t-blue-500" : ""}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <div className="cursor-grab active:cursor-grabbing mt-1">
                          <DragHandle />
                        </div>
                        <div>
                          <h3 className="font-medium">{card.title}</h3>
                          <p className="text-sm text-gray-600">
                            {card.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCard(card);
                            setIsCardModalOpen(true);
                          }}
                          className="text-gray-600 hover:text-gray-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCard(card.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setActiveColumnId(column.id);
                    setIsCardModalOpen(true);
                  }}
                  className="w-full text-left text-gray-600 hover:text-gray-800 text-sm mt-2"
                >
                  + Add Card
                </button>
              </div>
            </div>
          ))}

          {/* Unassigned Cards */}
          {showUnassigned && (
            <div className="bg-white rounded-lg shadow-md p-4 min-w-[300px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Unassigned Cards</h2>
              </div>
              <div className="space-y-2">
                {sortByOrder(
                  filteredCards.filter(
                    (card) =>
                      card.columnId === null ||
                      columns.every((col) => col.id !== card.columnId),
                  ),
                ).map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleCardDragStart(e, card)}
                    className="bg-gray-50 p-3 rounded border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <div className="cursor-grab active:cursor-grabbing mt-1">
                          <DragHandle />
                        </div>
                        <div>
                          <h3 className="font-medium">{card.title}</h3>
                          <p className="text-sm text-gray-600">
                            {card.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCard(card);
                            setIsCardModalOpen(true);
                          }}
                          className="text-gray-600 hover:text-gray-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCard(card.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {isColumnModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingColumn ? "Edit Column" : "Add Column"}
                </h2>
                <button
                  onClick={() => {
                    setIsColumnModalOpen(false);
                    setEditingColumn(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingColumn) {
                    updateColumn(
                      editingColumn.id,
                      columnTitle,
                      editingColumn.order,
                    );
                  } else {
                    createColumn(columnTitle);
                  }

                  setIsColumnModalOpen(false);
                  setEditingColumn(null);
                  setColumnTitle("");
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={columnTitle}
                    onChange={(e) => setColumnTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsColumnModalOpen(false);
                      setEditingColumn(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    {editingColumn ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isCardModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingCard ? "Edit Card" : "Add Card"}
                </h2>
                <button
                  onClick={() => {
                    setIsCardModalOpen(false);
                    setEditingCard(null);
                    setActiveColumnId(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const columnId = editingCard ? cardColumnId : activeColumnId;

                  if (editingCard) {
                    updateCard(
                      editingCard.id,
                      cardTitle,
                      cardDescription,
                      columnId === "" ? null : columnId,
                      editingCard.order,
                    );
                  } else {
                    if (!columnId) {
                      return;
                    }
                    createCard(columnId, cardTitle, cardDescription);
                  }

                  setIsCardModalOpen(false);
                  setEditingCard(null);
                  setActiveColumnId(null);
                  setCardTitle("");
                  setCardDescription("");
                  setCardColumnId("");
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={cardTitle}
                    onChange={(e) => setCardTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={cardDescription}
                    onChange={(e) => setCardDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
                {editingCard && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Column
                    </label>
                    <select
                      value={cardColumnId}
                      onChange={(e) => setCardColumnId(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">No Column</option>
                      {columns.map((column) => (
                        <option key={column.id} value={column.id}>
                          {column.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCardModalOpen(false);
                      setEditingCard(null);
                      setActiveColumnId(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    {editingCard ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
