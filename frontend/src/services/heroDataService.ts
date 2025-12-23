// Сервис для получения данных для Hero компонента
export const HeroDataService = {
  // Получить данные для статус блоков
  getStatusBlocks: async (userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/projects?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Ошибка загрузки данных");
      }

      const projects = data.projects || [];
      const totalProjects = projects.length;
      const activeProjects = projects.filter(
        (p) => p.status === "active"
      ).length;
      const completedProjects = projects.filter(
        (p) => p.status === "completed"
      ).length;

      return [
        {
          id: 1,
          text: "Проекты",
          value: totalProjects,
          className: "projectsCount",
          hasDot: false,
        },
        {
          id: 2,
          text: "Активные",
          value: activeProjects,
          className: "activeProjects",
          hasDot: true,
        },
        {
          id: 3,
          text: "Завершено",
          value: completedProjects,
          className: "completedProjects",
          hasDot: false,
        },
      ];
    } catch (error) {
      console.error("Ошибка загрузки статус блоков:", error);
      return [];
    }
  },

  // Получить активные проекты
  getActiveProjects: async (userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/projects?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Ошибка загрузки проектов");
      }

      const projects = data.projects || [];

      // Преобразуем в формат для Hero компонента
      return projects.map((project) => ({
        id: project.id,
        name: project.title,
        status: project.status || "active",
        statusText: getStatusText(project.status),
        progress: project.progress || 0,
        members: project.users?.length || 0,
        tasks: 0, // Пока нет данных о задачах
      }));
    } catch (error) {
      console.error("Ошибка загрузки активных проектов:", error);
      return [];
    }
  },

  // Получить команду проекта
  getProjectTeam: async (projectId: number) => {
    try {
      // Пока нет endpoint для команды, возвращаем пустой массив
      return [];
    } catch (error) {
      console.error("Ошибка загрузки команды проекта:", error);
      return [];
    }
  },

  // Получить дедлайны
  getDeadlines: async (userId: number) => {
    try {
      // Пока нет endpoint для дедлайнов, возвращаем пустой массив
      return [];
    } catch (error) {
      console.error("Ошибка загрузки дедлайнов:", error);
      return [];
    }
  },

  // Получить пользователя
  getUser: async (userId: number) => {
    try {
      // Пока нет endpoint для получения пользователя по ID
      // Возвращаем базовые данные
      return {
        id: userId,
        name: "Пользователь",
        email: "",
        avatar: "П",
        position: "",
        department: "",
        status: "active",
        online: true,
      };
    } catch (error) {
      console.error("Ошибка загрузки пользователя:", error);
      return null;
    }
  },
};

// Вспомогательная функция
const getStatusText = (status) => {
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
