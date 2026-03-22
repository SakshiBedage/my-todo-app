type FilterStatus = "all" | "completed" | "pending";

interface TodoFiltersProps {
  filterMode: FilterStatus;
  setFilterMode: (status: FilterStatus) => void;
  totalCount: number;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({
  filterMode,
  setFilterMode,
  totalCount,
}) => {
  const statuses: FilterStatus[] = ["all", "completed", "pending"];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
      <div className="flex bg-gray-100 p-1.5 rounded-xl shadow-inner border border-gray-200">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilterMode(status)}
            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              filterMode === status
                ? "bg-white text-red-600 shadow-sm scale-105"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Stats Badge */}
      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
        Total Items:{" "}
        <span className="text-red-600 font-black">{totalCount}</span>
      </div>
    </div>
  );
};

export default TodoFilters;
