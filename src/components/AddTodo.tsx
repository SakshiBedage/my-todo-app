import { useState } from "react";
import type { Todo } from "../types/todo";
import { addTodo } from "../services/api";

interface AddTodoProps {
  onTodoAdded: (newTodo: Todo) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ onTodoAdded }) => {
  const [taskName, setTaskName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    try {
      const result = await addTodo(taskName, 5);
      onTodoAdded(result);
      setTaskName("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
      <input
        className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 outline-none transition-all"
        placeholder="Add a new system task..."
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-transform active:scale-95">
        Submit
      </button>
    </form>
  );
};

export default AddTodo;
