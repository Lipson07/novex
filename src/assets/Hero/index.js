// src/assets/Osnova/data.js
export const quickActionsData = [
    {
      id: 1,
      title: "Создать задачу",
      gradient: "blue",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" stroke="white" strokeWidth="2" />
      </svg>`
    },
    {
      id: 2,
      title: "Командный чат",
      gradient: "purple",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3.12805C16.8578 3.35042 17.6174 3.85132 18.1597 4.55211C18.702 5.25291 18.9962 6.11394 18.9962 7.00005C18.9962 7.88616 18.702 8.74719 18.1597 9.44799C17.6174 10.1488 16.8578 10.6497 16 10.8721" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`
    },
    {
      id: 3,
      title: "Расписание",
      gradient: "orange",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
        <path d="M16 2V6M8 2V6M3 10H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>`
    },
    {
      id: 4,
      title: "Быстрая заметка",
      gradient: "green",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H16L20 7V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3V7H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 14H15M9 17H12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>`
    }
  ];
  
  export const statusBlocksData = [
    {
      id: 1,
      text: "Текущий спринт:",
      value: "Спринт 24",
      className: "statusBlock"
    },
    {
      id: 2,
      text: "Команда:",
      value: "Продукт & Дизайн",
      className: "statusBlock"
    },
    {
      id: 3,
      text: "Статус ИИ:",
      value: "Активен",
      className: "statusBlockAI",
      hasDot: true
    }
  ];
  
  export const projectsData = [
    {
      id: 1,
      name: "Редизайн продукта",
      status: "active",
      statusText: "активен",
      members: 5,
      tasks: 12,
      progress: 75
    },
    {
      id: 2,
      name: "Маркетинговая кампания",
      status: "active",
      statusText: "активен",
      members: 3,
      tasks: 8,
      progress: 45
    },
    {
      id: 3,
      name: "Интеграция API",
      status: "review",
      statusText: "на проверке",
      members: 4,
      tasks: 3,
      progress: 90
    }
  ];
  
  export const activitiesData = [
    {
      id: 1,
      avatar: "Ж",
      text: "Жирный Жид завершила проверку дизайна",
      time: "5 минут назад"
    },
    {
      id: 2,
      avatar: "Е",
      text: "Ебаное чмо прокомментировал дорожную карту",
      time: "12 минут назад"
    },
    {
      id: 3,
      avatar: "Т",
      text: "ТЦК создал новый спринт",
      time: "1 час назад"
    }
  ];