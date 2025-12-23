import { httpClient } from './httpClient';

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

export interface AuthResponse {
  user: User;
  token: string;
}

class UserService {
  // Регистрация нового пользователя
  async register(userData: {
    name: string;
    email: string;
    password: string;
    status: string;
  }): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/users/register', userData);
  }

  // Вход в систему
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/users/login', credentials);
  }

  // Выход из системы
  async logout(): Promise<void> {
    return httpClient.post('/users/logout');
  }

  // Проверка существования пользователя по email и имени
  async checkUser(email: string, name: string): Promise<{ exists: boolean; message?: string }> {
    return httpClient.get('/users/check-user', { params: { email, name } });
  }

  // Получить текущего пользователя
  async getCurrentUser(): Promise<User> {
    return httpClient.get<User>('/users/me');
  }

  // Обновить профиль пользователя
  async updateProfile(userId: number, data: Partial<User>): Promise<User> {
    return httpClient.put<User>(`/users/${userId}`, data);
  }

  // Получить список пользователей (например, для выбора назначения)
  async getUsers(): Promise<User[]> {
    return httpClient.get<User[]>('/users');
  }

  // Получить пользователя по ID
  async getUserById(id: number): Promise<User> {
    return httpClient.get<User>(`/users/${id}`);
  }

  // Сохранить токен в localStorage после успешной аутентификации
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Удалить токен (при выходе)
  removeToken(): void {
    localStorage.removeItem('token');
  }

  // Проверить, авторизован ли пользователь
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

export const userService = new UserService();
export default userService;