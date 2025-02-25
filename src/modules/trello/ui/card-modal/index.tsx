import { Modal } from "../../../../shared/modal";

interface IProps {
  isCardModalOpen: boolean;
  isEditing?: boolean;
  closeModal: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  cardDescription: string;
  setCardDescription: (cardDescription: string) => void;
  cardTitle: string;
  setCardTitle: (cardTitle: string) => void;
  cardColumnId: string;
  setCardColumnId: (cardColumnId: string) => void;
  activeColumnId: string | null;
  setActiveColumnId: (activeColumnId: string | null) => void;
  columns: React.ReactNode;
}

export const CardModal = ({isCardModalOpen, isEditing, closeModal, columns, onSubmit, cardDescription, setCardDescription, cardTitle, setCardTitle, cardColumnId, setCardColumnId, activeColumnId, setActiveColumnId}: IProps) => {
  return (
    <Modal
      isOpen={isCardModalOpen}
      closeModal={closeModal}
      title={isEditing ? "Edit Card" : "Add Card"}
      content={<>
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
          {isEditing && (
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
                {columns}
              </select>
            </div>
          )}
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
      </>}
    />
  );
};
