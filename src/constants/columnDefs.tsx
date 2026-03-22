import type { ColDef, ICellRendererParams } from "ag-grid-community";

import type { Todo } from "../types/todo";

// we define an interface so the file knows exactly what type of data we are working with, this is used in the column definitions to ensure type safety
interface TodoActionProps {
  onToggle: (id: number, currentStatus: boolean) => void;
  onDelete: (id: number) => void;
}

//Define tabel Columns
export const getTodoColumnDefs = (actions: TodoActionProps): ColDef<Todo>[] => [
  { field: "id", headerName: "ID", width: 80, sortable: true },
  { field: "userId", headerName: "UserID", width: 100, sortable: true },
  { field: "todo", headerName: "Task Description", flex: 1, filter: true },
  {
    field: "completed",
    headerName: "Status",
    width: 150,
    sortable: true,
    cellRenderer: (params: ICellRendererParams<Todo>) => (
      <div className="flex items-center gap-3 h-full">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            params.value
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {params.value ? "Completed" : "Pending"}
        </span>
        <button
          onClick={() =>
            actions.onToggle(params.data!.id, params.data!.completed)
          }
          className="text-blue-500 hover:text-blue-700 transition-colors"
        >
          {/* Your Blue SVG Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>
    ),
  },
  {
    headerName: "Actions",
    width: 120,
    cellRenderer: (params: ICellRendererParams<Todo>) => (
      <div className="flex gap-3 items-center h-full whitespace-nowrap">
        <button
          onClick={() => actions.onDelete(params.data!.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          {/* Your Red Delete SVG Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    ),
  },
];
