//todo.ts
export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface ApiResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}
