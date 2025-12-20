const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface Project {
  id: number;
  title: string;
  description: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
  progress?: number;
  members?: number;
  tasks?: number;
  status?: string;
  owner?: User;
  users?: User[];
}

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  avatar?: string;
  position?: string;
  department?: string;
  online?: boolean;
}

interface Task {
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

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Server error ${response.status}: ${data.message || "Unknown error"}`
      );
    }

    // Проверяем, есть ли поле success в ответе
    if (data.success !== undefined) {
      // Ответ в формате ApiResponse
      if (!data.success) {
        throw new Error(data.message || "Request error");
      }
      // Если data.data существует, возвращаем его, иначе весь data
      return (data.data !== undefined ? data.data : data) as T;
    }

    // Если success отсутствует, считаем ответ успешным и возвращаем как есть
    return data as T;
  }

  // Auth methods
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    status: string;
  }) {
    return this.request("/api/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async checkUser(email: string, name: string) {
    return this.request(`/api/users/check-user?email=${email}&name=${name}`, {
      method: "GET",
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request("/api/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  // Project methods
  async createProject(projectData: {
    tittle: string;
    description: string;
    owner_id: number;
  }) {
    return this.request<Project>("/api/projects/create", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  }

  async getUserProjects(userId: number) {
    return this.request<Project[]>(`/api/projects?user_id=${userId}`, {
      method: "GET",
    });
  }

  async getProjectById(projectId: number) {
    return this.request<Project>(`/api/projects/${projectId}`, {
      method: "GET",
    });
  }

  // Task methods
  async getTasks(params?: {
    project_id?: number;
    status?: string;
    assigned_to?: number;
    priority?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.project_id) query.append('project_id', params.project_id.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.assigned_to) query.append('assigned_to', params.assigned_to.toString());
    if (params?.priority) query.append('priority', params.priority);
    if (params?.sort_by) query.append('sort_by', params.sort_by);
    if (params?.sort_order) query.append('sort_order', params.sort_order);
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    const queryString = query.toString();
    const endpoint = `/api/tasks${queryString ? `?${queryString}` : ''}`;
    const result = await this.request<any>(endpoint, {
      method: "GET",
    });
    // Обработка пагинированного ответа (если result содержит поле data с массивом)
    if (result && typeof result === 'object' && Array.isArray(result.data)) {
      return result.data as Task[];
    }
    // Если ответ уже массив, возвращаем его
    if (Array.isArray(result)) {
      return result as Task[];
    }
    // Иначе возвращаем пустой массив (или можно выбросить ошибку)
    console.warn('Непредвиденный формат ответа от /tasks:', result);
    return [] as Task[];
  }

  async getTaskById(id: number) {
    return this.request<Task>(`/api/tasks/${id}`, {
      method: "GET",
    });
  }

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
  }) {
    return this.request<Task>('/api/tasks', {
      method: "POST",
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id: number, taskData: Partial<Task>) {
    return this.request<Task>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id: number) {
    return this.request(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  }

  async completeTask(id: number) {
    return this.request<Task>(`/api/tasks/${id}/complete`, {
      method: "POST",
    });
  }
}

export const apiService = new ApiService();
export type { Project, User, Task };
