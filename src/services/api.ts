import axios from "axios";

import type { ApiResponse, Todo } from "../types/todo";

const BASE_URL = "https://dummyjson.com/todos";

export const getTodos = async (limit: number = 30): Promise<Todo[]> => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}?limit=${limit}`);
  return response.data.todos;
};
