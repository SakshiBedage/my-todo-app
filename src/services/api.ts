import axios from "axios";

import type { ApiResponse, Todo } from "../types/todo";

const BASE_URL = "https://dummyjson.com/todos";

export const getTodos = async (limit: number = 40): Promise<Todo[]> => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}?limit=${limit}`);
  console.log("API Response:", response.data);
  return response.data.todos;
};

export const addTodo = async (todo: string, userId: number): Promise<Todo> => {
  const response = await axios.post(`${BASE_URL}/add`, {
    todo: todo,
    completed: false,
    userId: userId,
  });

  return response.data;
};
