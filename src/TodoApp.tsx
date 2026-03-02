import { useState } from "react";
interface Todo {
  id: number;
  text: string;
}

const TodoApp = () => {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = () => {
    if (input.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(), //unique id based on timestamp
      text: input,
    };

    setTodos([...todos, newTodo]);
    setInput("");
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((item) => item.id !== id));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "300px" }}>
      <h2>My Tasks</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What needs to be done"
      />
      <button onClick={addTodo} style={{ marginLeft: "10px" }}>
        Add
      </button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: "10ppx" }}>
            {todo.text}{" "}
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
