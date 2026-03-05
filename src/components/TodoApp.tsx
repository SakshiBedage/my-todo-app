import React, { useEffect, useState } from "react";
import { getTodos } from "../services/api";
import type { Todo } from "../types/todo";

const TodoIndex: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const data = await getTodos(10);
        setTodos(data);
      } catch (err) {
        setError("Failed to fetch todos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>System Todos</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              backgroundColor: todo.completed ? "#f9f9f9" : "#fff",
            }}
          >
            <strong
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.todo}
            </strong>
            <p style={{ fontSize: "12px", color: "#666" }}>
              Assigned to User: {todo.userId}
            </p>
          </li>
        ))}
      </ul>
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
