interface IProps {    
  header: React.ReactNode;
  search: React.ReactNode;
  list: React.ReactNode;
  isDragged?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}
export const Column = ({ header, search, list, isDragged, onDragStart, onDragOver, onDrop, onDragEnd }: IProps) => {
  return     <div
              draggable
              onDragStart={(e) => onDragStart?.(e)}
              onDragOver={(e) => onDragOver?.(e)}
              onDrop={(e) => onDrop?.(e)}
              onDragEnd={onDragEnd}
              className={`bg-white rounded-lg shadow-md p-4 min-w-[300px] ${
                isDragged ? "border-2 border-blue-500" : ""
              }`}
            >
              {header}
              {search}
              {list}
              </div>
};
