import { useEffect, useState } from "react";
import { Card, Column } from "../model/types";

export function useActions() {

  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [showUnassigned, setShowUnassigned] = useState(() => {
    const saved = localStorage.getItem("showUnassigned");
    return saved ? JSON.parse(saved) : false;
  });

    const [columnTitle, setColumnTitle] = useState("");
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardColumnId, setCardColumnId] = useState<string>("");

    useEffect(() => {
    localStorage.setItem("showUnassigned", JSON.stringify(showUnassigned));
  }, [showUnassigned]);

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

  return {
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
  }


}
