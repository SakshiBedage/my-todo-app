import axios from "axios";
import type { AxiosResponse } from "axios";

import type { ApiResponse, Todo } from "../types/todo";

const BASE_URL = "https://dummyjson.com/todos";

export const getTodos = async (limit: number): Promise<Todo[]> => {
  const response: AxiosResponse<ApiResponse> = await axios.get<ApiResponse>(
    `${BASE_URL}?limit=${limit}`,
  );
  console.log("API Response:", response.data);
  return response.data.todos;
};

export const addTodo = async (todo: string, userId: number): Promise<Todo> => {
  const response: AxiosResponse<Todo> = await axios.post(`${BASE_URL}/add`, {
    todo: todo,
    completed: false,
    userId: userId,
  });

  return response.data;
};
