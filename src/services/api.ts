import axios from "axios";
import type { AxiosResponse } from "axios";
import type { User } from "../types/user";
import type { ApiResponse, Todo } from "../types/todo";

const BASE_URL = "https://dummyjson.com/todos";
const AUTH_BASE_URL = "https://dummyjson.com/auth";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage =
      error.response?.data?.message ||
      "An unexpected error occurred with the Todo service.";

    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.reload();
    }

    return Promise.reject(new Error(serverMessage));
  },
);

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

export const loginUser = async (
  username: string,
  password: string,
): Promise<User> => {
  const response = await fetch(`${AUTH_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
      expiresInMins: 5,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
};

export const getAuthMe = async (token: string): Promise<User> => {
  const response = await fetch(`${AUTH_BASE_URL}/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch user profile");
  }
  return response.json();
};

export const refreshToken = async (refreshToken: string): Promise<User> => {
  const response = await fetch(`${AUTH_BASE_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refreshToken: refreshToken,
      expiresInMins: 5,
    }),
  });

  if (!response.ok) {
    throw new Error("Session expired. Please login again.");
  }
  return response.json();
};
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
