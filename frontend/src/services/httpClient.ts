const API_BASE_URL = "http://localhost:8000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  // Если true, не добавлять базовый URL (для внешних запросов)
  external?: boolean;
  // Если true, не парсить ответ как JSON (например, для blob)
  raw?: boolean;
}

export type Interceptor = (request: Request) => Request | Promise<Request>;
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

class HttpClient {
  private baseUrl: string;
  private interceptors: Interceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Добавить интерцептор запроса
  addInterceptor(interceptor: Interceptor): void {
    this.interceptors.push(interceptor);
  }

  // Добавить интерцептор ответа
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  // Удалить интерцептор
  removeInterceptor(interceptor: Interceptor): void {
    this.interceptors = this.interceptors.filter(i => i !== interceptor);
  }

  // Применить все интерцепторы к запросу
  private async applyInterceptors(request: Request): Promise<Request> {
    let processedRequest = request;
    for (const interceptor of this.interceptors) {
      processedRequest = await interceptor(processedRequest);
    }
    return processedRequest;
  }

  // Применить интерцепторы ответа
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let processedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse);
    }
    return processedResponse;
  }

  // Построить URL с параметрами
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    if (!params) return url;

    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  // Основной метод запроса
  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      params,
      external = false,
      raw = false,
      headers = {},
      ...fetchOptions
    } = options;

    // Построить полный URL
    const url = external ? endpoint : this.buildUrl(endpoint, params);

    // Подготовить заголовки
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Добавить токен авторизации, если есть
    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const finalHeaders = { ...defaultHeaders, ...headers };

    // Создать объект запроса
    let request = new Request(url, {
      ...fetchOptions,
      headers: finalHeaders,
    });

    // Применить интерцепторы запроса
    request = await this.applyInterceptors(request);

    // Выполнить запрос
    let response: Response;
    try {
      response = await fetch(request);
    } catch (error) {
      // Сетевая ошибка
      throw new Error(`Network error: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Применить интерцепторы ответа
    response = await this.applyResponseInterceptors(response);

    // Обработка сырого ответа (например, для blob)
    if (raw) {
      return response as unknown as T;
    }

    // Парсинг JSON
    let data: any;
    try {
      data = await response.json();
    } catch (error) {
      // Если ответ не JSON, выбросить ошибку
      throw new Error(`Invalid JSON response: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Проверка статуса ответа
    if (!response.ok) {
      // Попробовать извлечь сообщение об ошибке из data
      const message = data?.message || `Server error ${response.status}`;
      const errors = data?.errors;
      const error = new Error(message) as any;
      error.status = response.status;
      error.errors = errors;
      error.data = data;
      throw error;
    }

    // Проверка формата ответа (если есть поле success)
    if (data && typeof data === 'object' && 'success' in data) {
      if (!data.success) {
        const error = new Error(data.message || 'Request failed');
        (error as any).data = data;
        throw error;
      }
      // Возвращаем data.data, если он существует, иначе весь data
      return data.data !== undefined ? data.data : data;
    }

    // Если success отсутствует, возвращаем данные как есть
    return data;
  }

  // Методы-помощники
  get<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Создаём экземпляр по умолчанию
const httpClient = new HttpClient();

// Пример интерцептора для логирования
httpClient.addInterceptor(async (request) => {
  console.log(`[HTTP] ${request.method} ${request.url}`);
  return request;
});

// Пример интерцептора для обработки ошибок сети
httpClient.addResponseInterceptor(async (response) => {
  if (!response.ok) {
    console.warn(`[HTTP] Response status ${response.status} for ${response.url}`);
  }
  return response;
});

export { httpClient, HttpClient };
export default httpClient;