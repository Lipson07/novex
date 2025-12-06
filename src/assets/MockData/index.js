// Мок-данные проектов
export const mockProjects = [
  {
    id: 1,
    tittle: "Тестовый проект",
    description: "Описание тестового проекта",
    owner_id: 1,
    created_at: "2025-12-05T20:31:47.000Z",
    updated_at: "2025-12-05T20:31:47.000Z",
    progress: 75,
    members: 5,
    tasks: 23,
    status: "active",
  },
  {
    id: 2,
    tittle: "Лендинг",
    description: "Разработка лендинга с понятным ux/ui",
    owner_id: 1,
    created_at: "2025-12-05T20:45:03.000Z",
    updated_at: "2025-12-05T20:45:03.000Z",
    progress: 45,
    members: 3,
    tasks: 12,
    status: "review",
  },
  {
    id: 3,
    tittle: "Веб-приложение",
    description: "Разработка современного веб-приложения",
    owner_id: 1,
    created_at: "2025-12-04T10:15:22.000Z",
    updated_at: "2025-12-04T10:15:22.000Z",
    progress: 90,
    members: 8,
    tasks: 45,
    status: "active",
  },
  {
    id: 4,
    tittle: "Мобильное приложение",
    description: "iOS и Android приложение",
    owner_id: 1,
    created_at: "2025-12-03T14:30:10.000Z",
    updated_at: "2025-12-03T14:30:10.000Z",
    progress: 25,
    members: 4,
    tasks: 18,
    status: "active",
  },
  {
    id: 5,
    tittle: "Дизайн система",
    description: "Создание дизайн-системы для компании",
    owner_id: 1,
    created_at: "2025-12-02T09:20:15.000Z",
    updated_at: "2025-12-02T09:20:15.000Z",
    progress: 100,
    members: 6,
    tasks: 32,
    status: "completed",
  },
];

// Мок-данные пользователей
export const mockUsers = [
  {
    id: 1,
    name: "Алексей Иванов",
    email: "alexey@example.com",
    avatar: "АИ",
    position: "Product Manager",
    department: "Продукт",
    status: "active",
    online: true,
  },
  {
    id: 2,
    name: "Мария Петрова",
    email: "maria@example.com",
    avatar: "МП",
    position: "UI/UX Designer",
    department: "Дизайн",
    status: "active",
    online: true,
  },
  {
    id: 3,
    name: "Дмитрий Сидоров",
    email: "dmitry@example.com",
    avatar: "ДС",
    position: "Frontend Developer",
    department: "Разработка",
    status: "active",
    online: false,
  },
  {
    id: 4,
    name: "Елена Козлова",
    email: "elena@example.com",
    avatar: "ЕК",
    position: "Backend Developer",
    department: "Разработка",
    status: "active",
    online: true,
  },
  {
    id: 5,
    name: "Иван Николаев",
    email: "ivan@example.com",
    avatar: "ИН",
    position: "QA Engineer",
    department: "Тестирование",
    status: "active",
    online: true,
  },
];

// Мок-данные команд проектов
export const projectTeams = [
  {
    projectId: 1,
    members: [
      { userId: 1, role: "Руководитель проекта" },
      { userId: 2, role: "Дизайнер" },
      { userId: 3, role: "Разработчик" },
      { userId: 4, role: "Разработчик" },
      { userId: 5, role: "Тестировщик" },
    ],
  },
  {
    projectId: 2,
    members: [
      { userId: 1, role: "Руководитель проекта" },
      { userId: 2, role: "Дизайнер" },
      { userId: 3, role: "Разработчик" },
    ],
  },
  {
    projectId: 3,
    members: [
      { userId: 1, role: "Руководитель проекта" },
      { userId: 3, role: "Ведущий разработчик" },
      { userId: 4, role: "Разработчик" },
      { userId: 5, role: "Тестировщик" },
    ],
  },
];

// Мок-данные дедлайнов
export const deadlinesData = [
  {
    id: 1,
    projectId: 1,
    title: "Презентация дизайна",
    date: "2025-12-15",
    priority: "high",
    status: "upcoming",
  },
  {
    id: 2,
    projectId: 2,
    title: "Запуск бета-версии",
    date: "2025-12-20",
    priority: "medium",
    status: "upcoming",
  },
  {
    id: 3,
    projectId: 3,
    title: "Code Review",
    date: "2025-12-10",
    priority: "high",
    status: "today",
  },
  {
    id: 4,
    projectId: 1,
    title: "Синхронизация команды",
    date: "2025-12-08",
    priority: "low",
    status: "completed",
  },
];

// Быстрый доступ к функциям
export const quickAccessData = [
  {
    id: 1,
    title: "Создать отчет",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>`,
    action: "createReport",
  },
  {
    id: 2,
    title: "Планирование",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>`,
    action: "planning",
  },
  {
    id: 3,
    title: "Аналитика",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>`,
    action: "analytics",
  },
  {
    id: 4,
    title: "Документы",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H16L20 7V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 3V7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 14H15M9 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>`,
    action: "documents",
  },
];

// Мок-сервис для работы с проектами
export const ProjectService = {
  // Получить проекты пользователя (мок версия)
  getUserProjects: async (userId) => {
    console.log(`[Mock API] Получение проектов пользователя ${userId}`);

    // Эмуляция задержки сети
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Фильтруем проекты по owner_id
    const userProjects = mockProjects.filter(
      (project) => project.owner_id === userId
    );

    return userProjects;
  },

  // Получить все проекты (мок версия)
  getAllProjects: async () => {
    console.log("[Mock API] Получение всех проектов");

    await new Promise((resolve) => setTimeout(resolve, 0));

    return [...mockProjects];
  },

  // Создать проект (мок версия)
  createProject: async (projectData) => {
    console.log("[Mock API] Создание проекта:", projectData);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const newProject = {
      id: mockProjects.length + 1,
      ...projectData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      progress: 0,
      members: 1,
      tasks: 0,
      status: "active",
    };

    mockProjects.unshift(newProject); // Добавляем в начало массива

    return newProject;
  },

  // Получить проект по ID (мок версия)
  getProjectById: async (projectId) => {
    console.log(`[Mock API] Получение проекта ${projectId}`);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const project = mockProjects.find((p) => p.id === projectId);
    
    if (!project) {
      throw new Error("Проект не найден");
    }

    return project;
  },
};

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
