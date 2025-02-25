import { Card } from "./modules/trello/ui/card";
import { AddCardBtn } from "./modules/trello/ui/add-card-btn";
import { CardList } from "./modules/trello/ui/card-list";
import { ColumnListSearch } from "./modules/trello/ui/column-list-search";
import { ColumnHeader } from "./modules/trello/ui/column-header";
import { Column } from "./modules/trello/ui/column";
import { Actions } from "./modules/trello/ui/actions";
import { ColumnModal } from "./modules/trello/ui/column-modal";
import { CardModal } from "./modules/trello/ui/card-modal";
import { useActions } from "./modules/trello/lib/use-actions";
import { useColumn } from "./modules/trello/lib/use-column";
import { TrelloLayout } from "./modules/trello/ui/layout";




function App() {

  const {
    isColumnModalOpen,
    isCardModalOpen,
    editingColumn,
    editingCard,
    activeColumnId,
    showUnassigned,
    columnTitle,
    cardTitle,
    cardDescription,
    cardColumnId,
    setIsColumnModalOpen,
    setIsCardModalOpen,
    setEditingColumn,
    setEditingCard,
    setActiveColumnId,
    setShowUnassigned,
    setColumnTitle,
    setCardTitle,
    setCardDescription,
    setCardColumnId,
  } = useActions();

  const {
    searchQuery,
    setSearchQuery,
    columns,
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
  } = useColumn();

  const handleColumnModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingColumn) {
      updateColumn(editingColumn.id, columnTitle, editingColumn.order);
    } else {
      createColumn(columnTitle);
    }

    setIsColumnModalOpen(false);
    setEditingColumn(null);
    setColumnTitle("");
  };

  const handleCardModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const columnId = editingCard ? cardColumnId : activeColumnId;

    if (!columnId && !editingCard) return;

    if (editingCard) {
      updateCard(
        editingCard.id,
        cardTitle,
        cardDescription,
        cardColumnId === "" ? null : cardColumnId,
        editingCard.order
      );
    } else if (columnId) {
      createCard(columnId, cardTitle, cardDescription);
    }

    setIsCardModalOpen(false);
    setEditingCard(null);
    setActiveColumnId(null);
    setCardTitle("");
    setCardDescription("");
    setCardColumnId("");
  };

  const renderColumnCards = (columnId: string) => (
    <>
      {getColumnCards(columnId).map((card) => (
        <Card
          key={card.id}
          handleCardDragStart={(e) => handleCardDragStart(e, card)}
          handleCardDragOver={(e) => handleCardDragOver(e, card.id)}
          handleCardDrop={(e) => handleCardDrop(e, columnId, card.id)}
          handleDragEnd={handleDragEnd}
          isDragged={draggedCard?.id === card.id}
          isDragOver={dragOverCardId === card.id}
          onClickEdit={() => {
            setEditingCard(card);
            setIsCardModalOpen(true);
          }}
          onClickDelete={() => deleteCard(card.id)}
          title={card.title}
          description={card.description}
        />
      ))}
      <AddCardBtn
        onClick={() => {
          setActiveColumnId(columnId);
          setIsCardModalOpen(true);
        }}
      />
    </>
  );

  const renderUnassignedCards = () => (
    sortByOrder(
      filteredCards.filter(
        (card) =>
          card.columnId === null ||
          columns.every((col) => col.id !== card.columnId)
      )
    ).map((card) => (
      <Card
        key={card.id}
        handleCardDragStart={(e) => handleCardDragStart(e, card)}
        onClickEdit={() => {
          setEditingCard(card);
          setIsCardModalOpen(true);
        }}
        onClickDelete={() => deleteCard(card.id)}
        title={card.title}
        description={card.description}
      />
    ))
  );

  return (
    <TrelloLayout
      actions={
        <Actions
          handleAddColumn={() => setIsColumnModalOpen(true)}
          handleShowUnassigned={() => setShowUnassigned(!showUnassigned)}
          showUnassigned={showUnassigned}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      }
      sortedColumns={<>
      {sortedColumns.map((column) => (
            <Column
              onDragStart={(e) => handleColumnDragStart(e, column)}
              onDragOver={(e) => handleColumnDragOver(e, column.id)}
              onDrop={(e) => handleColumnDrop(e, column.id)}
              onDragEnd={handleDragEnd}
              isDragged={dragOverColumnId === column.id}
              header={
                <ColumnHeader
                  title={column.title}
                  onEdit={() => {
                    setEditingColumn(column);
                    setIsColumnModalOpen(true);
                  }}
                  onDelete={() => deleteColumn(column.id)}
                />
              }
              search={
                <ColumnListSearch
                  value={columnSearchQueries[column.id] || ""}
                  onChange={(e) =>
                    setColumnSearchQueries((prev) => ({
                      ...prev,
                      [column.id]: e.target.value,
                    }))
                  }
                />
              }
              list={
                <CardList
                  isDragged={Boolean(
                    draggedCard && getColumnCards(column.id).length === 0,
                  )}
                  onDragOver={(e) => handleCardDragOver(e, column.id)}
                  onDrop={(e) => handleCardDrop(e, column.id)}
                  list={renderColumnCards(column.id)}
                />
              }
            />
          ))}
        </>
        }
        unassignedColumn={<>
            {showUnassigned && (
            <Column
              header={<ColumnHeader title="Unassigned Cards" />}
              search={<ColumnListSearch value="" onChange={() => {}} />}
              list={
                <CardList
                  list={renderUnassignedCards()}
                />
              }
            />
          )}
          </>}
        columnModal={  <ColumnModal
          isColumnModalOpen={isColumnModalOpen}
          isEditing={editingColumn !== null}
          closeModal={() => {
            setIsColumnModalOpen(false);
            setEditingColumn(null);
          }}
          onSubmit={handleColumnModalSubmit}
          columnTitle={columnTitle}
          setColumnTitle={setColumnTitle}
        />}
        cardModal={     <CardModal
            isCardModalOpen={isCardModalOpen}
            isEditing={editingCard !== null}
            closeModal={() => {
              setIsCardModalOpen(false);
              setEditingCard(null);
              setActiveColumnId(null);
            }}
            onSubmit={handleCardModalSubmit}
            cardDescription={cardDescription}
            setCardDescription={setCardDescription}
            cardTitle={cardTitle}
            setCardTitle={setCardTitle}
            cardColumnId={cardColumnId}
            setCardColumnId={setCardColumnId}
            activeColumnId={activeColumnId}
            setActiveColumnId={setActiveColumnId}
            columns={columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.title}
              </option>
            ))}
          />}
    />

  );
}

export default App;
