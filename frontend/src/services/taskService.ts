import { httpClient } from './httpClient';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  project_id?: number;
  created_by: number;
  assigned_to?: number;
  completed_at?: string;
  tags?: string[];
  assignee?: User;
  creator?: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  avatar?: string;
  position?: string;
  department?: string;
  online?: boolean;
}

export interface GetTasksParams {
  project_id?: number;
  status?: string;
  assigned_to?: number;
  priority?: string;
  sort_by?: string;
  sort_order?: string;
  per_page?: number;
}

class TaskService {
  // Получить список задач с фильтрами
  async getTasks(params?: GetTasksParams): Promise<Task[]> {
    const result = await httpClient.get<any>('/tasks', { params });
    // Обработка пагинированного ответа (если result содержит поле data с массивом)
    if (result && typeof result === 'object' && Array.isArray(result.data)) {
      return result.data as Task[];
    }
    // Если ответ уже массив, возвращаем его
    if (Array.isArray(result)) {
      return result as Task[];
    }
    // Иначе возвращаем пустой массив
    console.warn('Непредвиденный формат ответа от /tasks:', result);
    return [];
  }

  // Получить задачу по ID
  async getTaskById(id: number): Promise<Task> {
    return httpClient.get<Task>(`/tasks/${id}`);
  }

  // Создать задачу
  async createTask(taskData: {
    title: string;
    description?: string;
    status: string;
    priority: string;
    due_date?: string;
    project_id?: number;
    assigned_to?: number;
    tags?: string[];
    created_by: number;
  }): Promise<Task> {
    return httpClient.post<Task>('/tasks', taskData);
  }

  // Обновить задачу
  async updateTask(id: number, taskData: Partial<Task>): Promise<Task> {
    return httpClient.put<Task>(`/tasks/${id}`, taskData);
  }

  // Удалить задачу
  async deleteTask(id: number): Promise<void> {
    return httpClient.delete(`/tasks/${id}`);
  }

  // Отметить задачу как выполненную
  async completeTask(id: number): Promise<Task> {
    return httpClient.post<Task>(`/tasks/${id}/complete`);
  }

  // Изменить статус задачи
  async changeStatus(id: number, status: string): Promise<Task> {
    return httpClient.patch<Task>(`/tasks/${id}/status`, { status });
  }

  // Назначить задачу пользователю
  async assignTask(id: number, userId: number): Promise<Task> {
    return httpClient.patch<Task>(`/tasks/${id}/assign`, { assigned_to: userId });
  }

  // Получить задачи по проекту
  async getTasksByProject(projectId: number): Promise<Task[]> {
    return this.getTasks({ project_id: projectId });
  }
}

export const taskService = new TaskService();
export default taskService;