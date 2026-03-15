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

export const updateTodo = async (
  id: number,
  completed: boolean,
): Promise<Todo> => {
  const response: AxiosResponse<Todo> = await axios.put(`${BASE_URL}/${id}`, {
    completed: completed,
  });
  return response.data;
};

export const deleteTodo = async (
  id: number,
): Promise<{ id: number; isDeleted: boolean }> => {
  const response: AxiosResponse<{ id: number; isDeleted: boolean }> =
    await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
