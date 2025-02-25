interface IProps {
  onClick: () => void;
}

export const AddCardBtn = ({ onClick }: IProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left text-gray-600 hover:text-gray-800 text-sm mt-2"
    >
      + Add Card
    </button>
  );
};
