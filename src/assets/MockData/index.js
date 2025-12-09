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
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Сегодня";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Завтра";
  } else {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });
  }
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
const API_BASE_URL = "http://localhost:8000/api";

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
      const response = await fetch(`${API_BASE_URL}/createProj`, {
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
            const validationErrors = Object.values(errorData.errors).flat().join(", ");
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
};
