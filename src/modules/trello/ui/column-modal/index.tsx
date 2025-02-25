import { Modal } from "../../../../shared/modal";

interface IProps{
  isColumnModalOpen: boolean;
  isEditing: boolean;
  closeModal: ()=>void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>)=>void;
  columnTitle: string;
  setColumnTitle: (title: string)=>void;
}
export const ColumnModal = ({isColumnModalOpen, isEditing, closeModal, columnTitle, setColumnTitle, onSubmit}: IProps) => {


  return (
    <Modal
      isOpen={isColumnModalOpen}
      closeModal={closeModal}
      title={isEditing ? "Edit Column" : "Add Column"}
      content={
        <>
          <form
            onSubmit={(e) => {
              onSubmit(e);
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
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                {isEditing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </>
      }
    />
   
  );
};
