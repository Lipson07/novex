// Хелпер функции
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "#05df72";
    case "review":
      return "#fdc700";
    case "completed":
      return "#667eea";
    default:
      return "#667eea";
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case "active":
      return "Активный";
    case "review":
      return "На проверке";
    case "completed":
      return "Завершен";
    default:
      return "В работе";
  }
};

// Хелпер для форматирования даты дедлайна
export const formatDeadlineDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Сбрасываем время для сравнения дат
  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  if (isToday) {
    return 'Сегодня';
  }
  if (isTomorrow) {
    return 'Завтра';
  }

  const diffMs = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 1 && diffDays <= 7) {
    // Склонение для дней
    const pluralize = (count, one, two, five) => {
      const n = Math.abs(count) % 100;
      const n1 = n % 10;
      if (n > 10 && n < 20) return five;
      if (n1 === 1) return one;
      if (n1 >= 2 && n1 <= 4) return two;
      return five;
    };
    return `Через ${diffDays} ${pluralize(diffDays, 'день', 'дня', 'дней')}`;
  }

  // Если больше недели, показываем дату
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
};

// Хелпер для получения цвета приоритета
export const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "#FF6467";
    case "medium":
      return "#FDC700";
    case "low":
      return "#667EEA";
    default:
      return "#667EEA";
  }
};

// Константа для базового URL API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Реальный сервис для работы с проектами
export const ProjectService = {
  // Получить проекты пользователя (реальная версия)
  getUserProjects: async (userId) => {
    if (!userId) {
      throw new Error("ID пользователя не указан");
    }

    console.log(`[API] Получение проектов пользователя ${userId}`);
    try {
      const response = await fetch(
        `${API_BASE_URL}/projects?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Проверяем статус ответа перед парсингом JSON
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Ошибка загрузки проектов";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Ошибка загрузки проектов");
      }

      return data.projects || [];
    } catch (error) {
      console.error("Ошибка загрузки проектов:", error);
      // Если это уже наша ошибка, пробрасываем дальше
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Неожиданная ошибка при загрузке проектов");
    }
  },

  // Получить все проекты пользователя (использует текущего пользователя)
  getAllProjects: async (userId) => {
    if (!userId) {
      throw new Error("ID пользователя не указан");
    }

    console.log(`[API] Получение всех проектов пользователя ${userId}`);
    // Используем getUserProjects, так как это то же самое
    return ProjectService.getUserProjects(userId);
  },

  // Создать проект (реальная версия)
  createProject: async (projectData) => {
    console.log("[API] Создание проекта:", projectData);

    // Валидация данных перед отправкой
    if (!projectData.tittle || !projectData.tittle.trim()) {
      throw new Error("Название проекта обязательно");
    }
    if (!projectData.owner_id) {
      throw new Error("ID владельца проекта обязателен");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          tittle: projectData.tittle.trim(),
          description: projectData.description?.trim() || "",
          owner_id: projectData.owner_id,
        }),
      });

      // Проверяем статус ответа перед парсингом JSON
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Ошибка создания проекта";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
          // Если есть ошибки валидации, добавляем их
          if (errorData.errors) {
            const validationErrors = Object.values(errorData.errors)
              .flat()
              .join(", ");
            errorMessage = `${errorMessage}: ${validationErrors}`;
          }
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Ошибка создания проекта");
      }

      return data.project;
    } catch (error) {
      console.error("Ошибка создания проекта:", error);
      // Если это уже наша ошибка, пробрасываем дальше
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Неожиданная ошибка при создании проекта");
    }
  },

  // Получить проект по ID (реальная версия)
  getProjectById: async (projectId, userId) => {
    if (!projectId) {
      throw new Error("ID проекта не указан");
    }

    console.log(`[API] Получение проекта ${projectId}`);
    try {
      // Используем getUserProjects и фильтруем по ID проекта
      if (!userId) {
        throw new Error("ID пользователя не указан");
      }

      const allProjects = await ProjectService.getUserProjects(userId);
      const project = allProjects.find((p) => p.id === projectId);

      if (!project) {
        throw new Error(`Проект с ID ${projectId} не найден`);
      }

      return project;
    } catch (error) {
      console.error("Ошибка загрузки проекта:", error);
      // Пробрасываем ошибку дальше с более информативным сообщением
      if (error.message.includes("не найден")) {
        throw error;
      }
      throw new Error(`Не удалось загрузить проект: ${error.message}`);
    }
  },

  // Создать задачу (реальная версия)
  createTask: async (taskData) => {
    console.log("[API] Создание задачи:", taskData);

    // Валидация данных перед отправкой
    if (!taskData.title || !taskData.title.trim()) {
      throw new Error("Название задачи обязательно");
    }
    if (!taskData.created_by) {
      throw new Error("ID создателя задачи обязателен");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          title: taskData.title.trim(),
          description: taskData.description?.trim() || "",
          status: taskData.status || "pending",
          priority: taskData.priority || "medium",
          due_date: taskData.due_date || null,
          project_id: taskData.project_id || null,
          assigned_to: taskData.assigned_to || null,
          tags: taskData.tags || [],
          created_by: taskData.created_by,
        }),
      });

      // Проверяем статус ответа перед парсингом JSON
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Ошибка создания задачи";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
          // Если есть ошибки валидации, добавляем их
          if (errorData.errors) {
            const validationErrors = Object.values(errorData.errors)
              .flat()
              .join(", ");
            errorMessage = `${errorMessage}: ${validationErrors}`;
          }
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // В TaskController метод store возвращает задачу напрямую, без обертки success
      // Проверим структуру ответа
      if (data.id) {
        return data;
      } else if (data.success === false) {
        throw new Error(data.message || "Ошибка создания задачи");
      } else {
        return data;
      }
    } catch (error) {
      console.error("Ошибка создания задачи:", error);
      // Если это уже наша ошибка, пробрасываем дальше
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Неожиданная ошибка при создании задачи");
    }
  },

  // Получить список пользователей (реальная версия)
  getUsers: async () => {
    console.log("[API] Получение списка пользователей");
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Ошибка загрузки пользователей";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Ошибка загрузки пользователей");
      }

      // Обработка пагинированного ответа (users может быть объектом с data)
      let users = data.users;
      if (
        users &&
        typeof users === "object" &&
        users.data &&
        Array.isArray(users.data)
      ) {
        users = users.data;
      } else if (!Array.isArray(users)) {
        users = [];
      }

      return users;
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Неожиданная ошибка при загрузки пользователей");
    }
  },

  // Удалить проект (реальная версия)
  deleteProject: async (projectId, userId) => {
    if (!projectId || !userId) {
      throw new Error("ID проекта и пользователя обязательны");
    }

    console.log(`[API] Удаление проекта ${projectId} пользователем ${userId}`);
    try {
      const response = await fetch(`${API_BASE_URL}/projects/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Ошибка удаления проекта";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Ошибка удаления проекта:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Неожиданная ошибка при удалении проекта");
    }
  },

  // Получить GitHub репозитории проекта (заглушка)
  getProjectRepos: async (projectId) => {
    console.log(`[API] Получение GitHub репозиториев проекта ${projectId}`);
    // TODO: реализовать реальный API
    // Возвращаем пустой массив, так как функционал ещё не реализован
    return [];
  },

  // Получить участников проекта (реальная версия)
  getProjectMembers: async (projectId) => {
    console.log(`[API] Получение участников проекта ${projectId}`);
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        // Если ошибка 500 из-за отсутствия отношения tasks, возвращаем пустой массив
        if (response.status === 500) {
          console.warn(`Сервер вернул 500 для проекта ${projectId}, возвращаем пустой массив участников`);
          return [];
        }
        const errorText = await response.text();
        let errorMessage = "Ошибка загрузки участников проекта";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Ошибка загрузки участников проекта");
      }

      // Возвращаем участников из данных проекта
      return data.project?.users || [];
    } catch (error) {
      console.error("Ошибка загрузки участников проекта:", error);
      // В случае любой ошибки возвращаем пустой массив, чтобы не ломать UI
      console.warn("Возвращаем пустой массив участников из-за ошибки");
      return [];
    }
  },

  // Получить логи активности проекта (заглушка)
  getActivityLogs: async (projectId) => {
    console.log(`[API] Получение логов активности проекта ${projectId}`);
    // TODO: реализовать реальный API
    // Возвращаем пустой массив, так как функционал ещё не реализован
    return [];
  },
};
