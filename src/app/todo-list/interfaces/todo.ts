export interface Todo {
  id: number;
  id_author: number;
  status: number;
  description: string;
  finish_at: string;
  created_at: string;
}
export type CreateTodo = Omit<Todo, 'id' | 'created_at'>;
