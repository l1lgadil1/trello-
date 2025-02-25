interface IProps {    
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ColumnListSearch = ({ value, onChange }: IProps) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search in column..."
        value={value}
        onChange={onChange}
        className="w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
};