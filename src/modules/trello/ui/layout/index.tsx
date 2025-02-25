
interface IProps {
  actions:React.ReactNode;
  sortedColumns:React.ReactNode;
  unassignedColumn:React.ReactNode;
  columnModal:React.ReactNode;
  cardModal:React.ReactNode;
}

export const TrelloLayout = ({ actions, sortedColumns, unassignedColumn, columnModal, cardModal }: IProps) => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8">
        {/* TOP */}
        {actions}
        {/* TOP */}
        <div className="flex gap-4 overflow-x-auto">
          {sortedColumns}
          {/* Unassigned Cards */}
        {unassignedColumn}
        </div>
        {/* Modals */}
        {columnModal}
        {cardModal}
      </div>
    </div>
  );
};