interface IProps {
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  content: React.ReactNode;
}
export const Modal = ({ isOpen, closeModal, title, content }: IProps) => {
  if(!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {title}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      {content}
      </div>
    </div>
  );
};
