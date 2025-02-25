interface IProps{
  handleAddColumn: ()=>void;
  showUnassigned: boolean;
  searchQuery: string;
  handleShowUnassigned: ()=>void;
  setSearchQuery: (query: string) => void;
}

export const Actions = ({handleAddColumn, handleShowUnassigned, showUnassigned, searchQuery, setSearchQuery}: IProps)=>{
     return <div className="flex justify-between items-center mb-4">
       <div className="flex gap-4 items-center">
         <button
           onClick={handleAddColumn}
           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
         >
           Add Column
         </button>
         <button
           onClick={handleShowUnassigned}
           className={`px-4 py-2 rounded border ${
             showUnassigned
               ? "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
               : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
           }`}
         >
           {showUnassigned ? "Hide Unassigned" : "Show Unassigned"}
         </button>
       </div>
       <div className="w-64">
         <input
           type="text"
           placeholder="Search cards..."
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
         />
       </div>
     </div>;
}