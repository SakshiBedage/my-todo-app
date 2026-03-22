import axios from "axios";
import type { AxiosResponse } from "axios";
import type { User } from "../types/user";
import type { ApiResponse, Todo } from "../types/todo";

const BASE_URL = "https://dummyjson.com/todos";
const AUTH_BASE_URL = "https://dummyjson.com/auth";

const isTokenExpired = () => {
  const loginTime = sessionStorage.getItem("loginTime");
  if (!loginTime) return true;

  const elapsed = Date.now() - parseInt(loginTime);
  return elapsed > 2 * 60 * 1000;
};

axios.interceptors.request.use(
  async (config) => {
    let token = sessionStorage.getItem("accessToken");

    if (!token) {
      return Promise.reject(
        new Error("Authentication required. Please login."),
      );
    }

    if (token && isTokenExpired()) {
      try {
        const userDataStr = sessionStorage.getItem("userData");
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);

          console.log("Token expired. Requesting new access token...");
          const data = await refreshToken(userData.refreshToken);

          token = data.accessToken;

          const mergedUser = { ...userData, ...data };
          sessionStorage.setItem("accessToken", data.accessToken);
          sessionStorage.setItem("userData", JSON.stringify(mergedUser));
          sessionStorage.setItem("loginTime", Date.now().toString());

          console.log("Token updated successfully. Resuming request.");
        }
      } catch (err) {
        console.error("Token refresh failed.");
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const getTodos = async (limit: number): Promise<Todo[]> => {
  const response: AxiosResponse<ApiResponse> = await axios.get<ApiResponse>(
    `${BASE_URL}?limit=${limit}`,
  );

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
      expiresInMins: 2,
    }),
  });
  if (response.ok) {
    // Record the exact time of login
    sessionStorage.setItem("loginTime", Date.now().toString());
  }

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
      expiresInMins: 2,
    }),
  });

  if (!response.ok) {
    throw new Error("Session expired. Please login again.");
  }
  return response.json();
};
