import React, { useEffect, useMemo, useState } from "react";
import { deleteTodo, getTodos, updateTodo } from "../services/api";
import type { Todo } from "../types/todo";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { getTodoColumnDefs } from "../constants/columnDefs";
import AddTodo from "./AddTodo";
import TodoGrid from "./TodoGrid";
import InitialMsg from "./InitialMsg";
import Header from "./Header";
import TodoFilters from "./TodoFilters";

ModuleRegistry.registerModules([AllCommunityModule]);

type FilterStatus = "all" | "completed" | "pending";

const TodoIndex: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<FilterStatus>("all");
  const [error, setError] = useState<string | null>(null);

  const handleError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  };

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
    } catch (err: any) {
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
    } catch (err: any) {
      handleError(err.message);
    }
  };

  const columnDefs = useMemo(
    () =>
      getTodoColumnDefs({
        onToggle: handleToggleComplete,
        onDelete: handleDelete,
      }),
    [todos],
  );

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTodos(40);
        setTodos(data);
      } catch (err: any) {
        handleError(`Failed to load tasks: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (loading) return <InitialMsg />;

  return (
    <div className="p-10 max-w-6xl mx-auto min-h-screen">
      {error && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl font-bold flex items-center gap-3 animate-bounce">
          <span>⚠️ {error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 hover:text-black"
          >
            ✕
          </button>
        </div>
      )}

      <Header />

      <div className="mb-10">
        <AddTodo onTodoAdded={handleTodoAdded} />
      </div>

      {/* AG Grid Container */}
      <TodoFilters
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        totalCount={filteredTodos.length}
      />

      {!loading && todos.length === 0 && !error ? (
        <div className="text-center p-20 text-gray-400">No tasks found.</div>
      ) : (
        <TodoGrid rowData={filteredTodos} columnDefs={columnDefs} />
      )}
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
