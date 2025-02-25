import { DragHandle } from "../drag-handle";

interface IProps {
  handleCardDragStart: (e: React.DragEvent) => void;
  handleCardDragOver?: (e: React.DragEvent) => void;
  handleCardDrop?: (e: React.DragEvent) => void;
  handleDragEnd?: () => void;
  isDragged?: boolean;
  isDragOver?: boolean;
  onClickEdit: () => void;
  onClickDelete: () => void;
  title: string;
  description: string;
}



export const Card = ({ handleCardDragStart, handleCardDragOver, handleCardDrop, handleDragEnd, isDragged, isDragOver, onClickEdit, onClickDelete, title, description }: IProps) => {
  return (
    <div
      draggable
      onDragStart={e=>handleCardDragStart(e)}
      onDragOver={e=>handleCardDragOver?.(e)}
      onDrop={e=>handleCardDrop?.(e)}
      onDragEnd={handleDragEnd}
      className={`bg-gray-50 p-3 rounded border border-gray-200 max-w-[300px] ${
        isDragged ? "opacity-50" : ""
      } ${isDragOver ? "border-t-4 border-t-blue-500" : ""}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          <div className="cursor-grab active:cursor-grabbing mt-1">
            <DragHandle />
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClickEdit}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={onClickDelete}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
