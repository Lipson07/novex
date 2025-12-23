// src/assets/Hero/data.js
export const statusBlocksData = [
  {
    id: 1,
    text: "Текущий спринт:",
    value: "Спринт 24",
    className: "statusBlock",
  },
  {
    id: 2,
    text: "Команда:",
    value: "Продукт & Дизайн",
    className: "statusBlock",
  },
  {
    id: 3,
    text: "Статус ИИ:",
    value: "Активен",
    className: "statusBlockAI",
    hasDot: true,
  },
];

export const projectsData = [
  {
    id: 1,
    name: "Редизайн продукта",
    status: "active",
    statusText: "активен",
    members: 5,
    tasks: 12,
    progress: 10,
  },
  {
    id: 2,
    name: "Маркетинговая кампания",
    status: "active",
    statusText: "активен",
    members: 3,
    tasks: 8,
    progress: 50,
  },
  {
    id: 3,
    name: "Интеграция API",
    status: "review",
    statusText: "на проверке",
    members: 4,
    tasks: 3,
    progress: 100,
  },
];

export const activitiesData = [
  {
    id: 1,
    avatar: "Ж",
    text: "Жирный Жид завершила проверку дизайна",
    time: "5 минут назад",
  },
  {
    id: 2,
    avatar: "Е",
    text: "Ебаное чмо прокомментировал дорожную карту",
    time: "12 минут назад",
  },
  {
    id: 3,
    avatar: "Т",
    text: "ТЦК создал новый спринт",
    time: "1 час назад",
  },
];

// Иконки для статусов прогресса
export const progressStatusIcons = {
  notStarted: `<svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 3V6L8 7" stroke="white" stroke-opacity="0.4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="white" stroke-opacity="0.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  earlyStage: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 14L11.1067 11.1067" stroke="white" stroke-opacity="0.4" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="white" stroke-opacity="0.4" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  inProgress: `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.3333 9.99984H16.2666C15.9024 9.99906 15.548 10.1176 15.2576 10.3373C14.9671 10.557 14.7566 10.8658 14.6583 11.2165L12.7 18.1832C12.6873 18.2264 12.661 18.2645 12.625 18.2915C12.5889 18.3186 12.545 18.3332 12.5 18.3332C12.4549 18.3332 12.411 18.3186 12.375 18.2915C12.3389 18.2645 12.3126 18.2264 12.3 18.1832L7.69996 1.8165C7.68734 1.77323 7.66102 1.73522 7.62496 1.70817C7.5889 1.68112 7.54504 1.6665 7.49996 1.6665C7.45488 1.6665 7.41102 1.68112 7.37496 1.70817C7.3389 1.73522 7.31258 1.77323 7.29996 1.8165L5.34163 8.78317C5.24368 9.13247 5.03444 9.44027 4.74568 9.65985C4.45691 9.87943 4.10439 9.9988 3.74163 9.99984H1.66663" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  goodProgress: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.6666 4.6665H14.6666V8.6665" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.6667 4.6665L9.00004 10.3332L5.66671 6.99984L1.33337 11.3332" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  almostDone: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  completed: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.3333 4L5.99996 11.3333L2.66669 8" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
};

// Данные для Dashboard
export const NeuralNetworkData = [
  {
    title: "Нейросеть знаний",
    gradient: "purple",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
<circle cx="5" cy="5" r="2" stroke="currentColor" stroke-width="2"/>
<circle cx="19" cy="5" r="2" stroke="currentColor" stroke-width="2"/>
<circle cx="5" cy="19" r="2" stroke="currentColor" stroke-width="2"/>
<circle cx="19" cy="19" r="2" stroke="currentColor" stroke-width="2"/>
<line x1="12" y1="9" x2="7" y2="7" stroke="currentColor" stroke-width="1.5"/>
<line x1="12" y1="9" x2="17" y2="7" stroke="currentColor" stroke-width="1.5"/>
<line x1="12" y1="15" x2="7" y2="17" stroke="currentColor" stroke-width="1.5"/>
<line x1="12" y1="15" x2="17" y2="17" stroke="currentColor" stroke-width="1.5"/>
</svg>`,
  },
  {
    title: "",
    gradient: "purple",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`,
  },
];

export const SmartSuggestionData = [
  {
    title: "Умные предложения",
    gradient: "blue",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    title: "Оптимизация",
    gradient: "orange",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    title: "Документы",
    gradient: "blue",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    title: "Команды",
    gradient: "green",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
<path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    title: "Проверка",
    gradient: "orange",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
];

export const KnolageGraphData = [
  {
    title: "Граф знаний",
    gradient: "purple",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
<path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`,
  },
  {
    title: "Быстрые фильтры",
    gradient: "blue",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`,
  },
];

export const FlowDashboardData = [
  {
    id: 1,
    title: "Поток работы",
    gradient: "blue",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    id: 2,
    title: "Глубокий фокус",
    gradient: "purple",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
<path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`,
  },
  {
    id: 3,
    title: "Завершено задач",
    gradient: "green",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    id: 4,
    title: "Эффективность",
    gradient: "orange",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 3v18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 7l-5 5-4-4-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
];
