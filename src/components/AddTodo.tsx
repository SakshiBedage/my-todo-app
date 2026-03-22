import { useState } from "react";
import type { Todo } from "../types/todo";
import { addTodo } from "../services/api";

interface AddTodoProps {
  onTodoAdded: (newTodo: Todo) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ onTodoAdded }) => {
  const [taskName, setTaskName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    try {
      setError(null);
      setIsSubmitting(true);
      const result = await addTodo(taskName, 5);
      onTodoAdded(result);
      setTaskName("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input
          className={`flex-1 p-3 border-2 rounded-lg outline-none transition-all ${
            error
              ? "border-red-300 bg-red-50"
              : "border-gray-200 focus:border-red-500"
          }`}
          placeholder="Add a new system task..."
          value={taskName}
          onChange={(e) => {
            setTaskName(e.target.value);
            if (error) setError(null);
          }}
        />
        <button
          disabled={isSubmitting}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-bold transition-transform active:scale-95 shadow-md"
        >
          {isSubmitting ? "Adding..." : "Add Task"}
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-sm font-bold ml-1 animate-in fade-in">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

export default AddTodo;
