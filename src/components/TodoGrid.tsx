import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import type { Todo } from "../types/todo";

ModuleRegistry.registerModules([AllCommunityModule]);

interface TodoGridProps {
  rowData: Todo[];
  columnDefs: ColDef<Todo>[];
}

const TodoGrid: React.FC<TodoGridProps> = ({ rowData, columnDefs }) => {
  return (
    <div
      className="ag-theme-alpine shadow-lg rounded-xl overflow-hidden"
      style={{ height: 500, width: "100%" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[5, 10, 20]}
        rowHeight={60}
        animateRows={true}
      />
    </div>
  );
};

export default TodoGrid;
