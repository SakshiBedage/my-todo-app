import React, { useEffect, useMemo, useState } from "react";
import { getTodos } from "../services/api";
import type { Todo } from "../types/todo";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import AddTodo from "./AddTodo";

ModuleRegistry.registerModules([AllCommunityModule]);

const TodoIndex: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);

  //Define tabel Columns
  const columnDefs = useMemo<ColDef<Todo>[]>(
    () => [
      { field: "id", headerName: "ID", width: 80, sortable: true },
      { field: "todo", headerName: "Task Description", flex: 1, filter: true },
      {
        field: "completed",
        headerName: "Status",
        width: 150,
        cellRenderer: (params: ICellRendererParams<Todo>) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold ${
              params.value
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {params.value ? "Completed" : "Pending"}
          </span>
        ),
      },
      { field: "userId", headerName: "UserID", width: 100 },
    ],
    [],
  );

  const handleTodoAdded = (newTodo: Todo) => {
    setTodos((prev) => [newTodo, ...prev]);
  };

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

  if (loading) return <div className="p-10 text-center">Loading Grid...</div>;

  return (
    <div className="p-10 max-w-2xl mx-auto min-h-screen">
      <h1 className="text-4xl font-extrabold text-red-600 mb-6 uppercase tracking-tight">
        System Todos
      </h1>

      <div className="mb-8">
        <AddTodo onTodoAdded={handleTodoAdded} />
      </div>

      {/* AG Grid Container */}
      <div
        className="ag-theme-alpine shadow-lg rounded-xl overflow-hidden"
        style={{ height: 500, width: "100%" }}
      >
        <AgGridReact
          rowData={todos}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20]}
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
