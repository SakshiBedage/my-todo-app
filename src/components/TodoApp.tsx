import React, { useEffect, useMemo, useState } from "react";
import { deleteTodo, getTodos, updateTodo } from "../services/api";
import type { Todo } from "../types/todo";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import AddTodo from "./AddTodo";

ModuleRegistry.registerModules([AllCommunityModule]);

type FilterStatus = "all" | "completed" | "pending";

const TodoIndex: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<FilterStatus>("all");
  // const [error, setError] = useState<string | null>(null);

  //Define tabel Columns
  const columnDefs = useMemo<ColDef<Todo>[]>(
    () => [
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

            {/* Toggle Button */}
            <button
              onClick={() =>
                handleToggleComplete(params.data!.id, params.data!.completed)
              }
              className="text-blue-500 hover:text-blue-700 transition-colors"
              title="Toggle Complete"
            >
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
            {/* Delete Button */}
            <button
              onClick={() => handleDelete(params.data!.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Delete Task"
            >
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
    ],
    [todos],
  );

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const data = await getTodos(40);
        setTodos(data);

        console.log("Fetched Todos:", data);
      } catch (err) {
        console.error("Grid Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleTodoAdded = (newTodo: Todo): void => {
    setTodos((prev) => [newTodo, ...prev]);
  };

  const filteredTodos = useMemo<Todo[]>(() => {
    if (filterMode === "all") return todos;
    if (filterMode === "completed") return todos.filter((t) => t.completed);
    if (filterMode === "pending") return todos.filter((t) => !t.completed);
    return todos;
  }, [todos, filterMode]);

  const handleToggleComplete = async (id: number, cuurentStatus: boolean) => {
    try {
      const updated = await updateTodo(id, !cuurentStatus);
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: updated.completed } : t,
        ),
      );
    } catch (err) {
      console.warn(
        "Server update failed (expected for new tasks), updating locally...",
      );
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !cuurentStatus } : t,
        ),
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete Failed:", err);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div
          className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"
          role="status"
        ></div>

        <h2 className="mt-4 text-lg font-semibold text-gray-600 tracking-wide">
          INITIALIZING DATA GRID...
        </h2>
      </div>
    );

  return (
    <div className="p-10 max-w-6xl mx-auto min-h-screen">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-red-600 uppercase tracking-tighter">
          System Todos
        </h1>
        <p className="text-gray-500 font-medium">Task Management Dashboard</p>
      </header>

      <div className="mb-10">
        <AddTodo onTodoAdded={handleTodoAdded} />
      </div>

      {/* AG Grid Container */}
      <div className="flex flex-col md:flex:row items-center justify-between mb-6 gpa-4">
        <div className="flex bg-gray-100 p-1.5 rounded-xl shadow-inner borderborder-gray-200">
          {(["all", "completed", "pending"] as FilterStatus[]).map((status) => (
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
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
          Total Items:{" "}
          <span className="text-red-600 font-black">
            {filteredTodos.length}
          </span>
        </div>
      </div>

      <div
        className="ag-theme-alpine shadow-lg rounded-xl overflow-hidden"
        style={{ height: 500, width: "100%" }}
      >
        <AgGridReact
          rowData={filteredTodos}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20]}
          rowHeight={60}
          animateRows={true}
        />
      </div>

      {/* <ul className="bg-white shadow-md rounded-lg overflow-hidden">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`p-4 border-b border-gray-200 last:border-0 ${
              todo.completed
                ? "bg-gray-50 text-gray-400"
                : "bg-white text-gray-800"
            }`}
          >
            <strong className={todo.completed ? "line-through" : ""}>
              {todo.todo}
            </strong>
            <p className="text-xs text-gray-500 mt-1">
              Assigned to User: {todo.userId}
            </p>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default TodoIndex;

// import { useState } from "react";
// interface Todo {
//   id: number;
//   text: string;
//   isEditing?: boolean;
// }

// const TodoApp = () => {
//   const [input, setInput] = useState("");
//   const [todos, setTodos] = useState<Todo[]>([]);

//   const [editText, setEditText] = useState("");

//   const addTodo = () => {
//     if (input.trim() === "") return;

//     const newTodo: Todo = {
//       id: Date.now(), //unique id based on timestamp
//       text: input,
//     };

//     setTodos([...todos, newTodo]);
//     setInput("");
//   };

//   const deleteTodo = (id: number) => {
//     setTodos(todos.filter((item) => item.id !== id));
//   };

//   const toggleEdit = (id: number, currentText: string) => {
//     setTodos(
//       todos.map((todo) =>
//         todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo,
//       ),
//     );
//     setEditText(currentText);
//   };

//   const saveEdit = (id: number) => {
//     setTodos(
//       todos.map((todo) =>
//         todo.id === id ? { ...todo, text: editText, isEditing: false } : todo,
//       ),
//     );
//   };
//   return (
//     <div style={{ padding: "20px", maxWidth: "300px" }}>
//       <h2>My Tasks</h2>
//       <input
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="What needs to be done"
//       />
//       <button onClick={addTodo} style={{ marginLeft: "10px" }}>
//         Add
//       </button>

//       <ul>
//         {todos.map((todo) => (
//           <li key={todo.id} style={{ marginBottom: "10px" }}>
//             {todo.isEditing ? (
//               <>
//                 <input
//                   value={editText}
//                   onChange={(e) => setEditText(e.target.value)}
//                 />
//                 <button
//                   onClick={() => saveEdit(todo.id)}
//                   style={{ marginLeft: "10px", color: "blue" }}
//                 >
//                   Save
//                 </button>
//               </>
//             ) : (
//               <>
//                 <span> {todo.text}</span>
//                 <button
//                   onClick={() => toggleEdit(todo.id, todo.text)}
//                   style={{ marginLeft: "10px", color: "blue" }}
//                 >
//                   Edit
//                 </button>
//               </>
//             )}

//             <button
//               onClick={() => deleteTodo(todo.id)}
//               style={{ marginLeft: "10px", color: "red" }}
//             >
//               X
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default TodoApp;
