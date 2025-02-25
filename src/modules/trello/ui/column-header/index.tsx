import { DragHandle } from "../drag-handle";

interface IProps {    
  title: string;
  onEdit?: () => void;
  onDelete?: () => void;
} 

export const ColumnHeader = ({ title, onEdit, onDelete }: IProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        {onEdit && onDelete && (
          <div className="cursor-grab active:cursor-grabbing">
            <DragHandle />
          </div>
        )}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="flex gap-2">
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-gray-600 hover:text-gray-800"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
