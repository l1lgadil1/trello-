interface IProps {
  isDragged?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  list: React.ReactNode;
} 

export const CardList = ({ isDragged, onDragOver, onDrop, list }: IProps) => {
  return  <div
                className={`space-y-2 min-h-[50px] ${
                  isDragged
                    ? "border-2 border-dashed border-gray-300 rounded-lg p-2"
                    : ""
                }`}
      onDragOver={(e) => onDragOver?.(e)}
      onDrop={(e) => onDrop?.(e)}
    >
      {list}
    </div>
};
