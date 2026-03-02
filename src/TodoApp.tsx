import { useState } from "react";
interface Todo {
  id: number;
  text: string;
  isEditing?: boolean;
}

const TodoApp = () => {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const [editText, setEditText] = useState("");

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

  const toggleEdit = (id: number, currentText: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo,
      ),
    );
    setEditText(currentText);
  };

  const saveEdit = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editText, isEditing: false } : todo,
      ),
    );
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
          <li key={todo.id} style={{ marginBottom: "10px" }}>
            {todo.isEditing ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button
                  onClick={() => saveEdit(todo.id)}
                  style={{ marginLeft: "10px", color: "blue" }}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span> {todo.text}</span>
                <button
                  onClick={() => toggleEdit(todo.id, todo.text)}
                  style={{ marginLeft: "10px", color: "blue" }}
                >
                  Edit
                </button>
              </>
            )}

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
