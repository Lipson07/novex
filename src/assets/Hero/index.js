// src/assets/Hero/data.js
export const quickActionsData = [
  {
    id: 1,
    title: "Создать задачу",
    gradient: "blue",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" stroke="white" strokeWidth="2" />
      </svg>`,
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
      </svg>`,
  },
  {
    id: 3,
    title: "Расписание",
    gradient: "orange",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
        <path d="M16 2V6M8 2V6M3 10H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>`,
  },
  {
    id: 4,
    title: "Быстрая заметка",
    gradient: "green",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H16L20 7V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3V7H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 14H15M9 17H12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>`,
  },
];

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
    progress: 75,
  },
  {
    id: 2,
    name: "Маркетинговая кампания",
    status: "active",
    statusText: "активен",
    members: 3,
    tasks: 8,
    progress: 45,
  },
  {
    id: 3,
    name: "Интеграция API",
    status: "review",
    statusText: "на проверке",
    members: 4,
    tasks: 3,
    progress: 90,
  },
];
export const NeuralNetworkData = [
  {
    id: 1,
    title: "Нейросеть",
    gradient: "blue",
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 13.3333H14.1667C13.7065 13.3333 13.3334 13.7063 13.3334 14.1666V17.4999C13.3334 17.9602 13.7065 18.3333 14.1667 18.3333H17.5C17.9603 18.3333 18.3334 17.9602 18.3334 17.4999V14.1666C18.3334 13.7063 17.9603 13.3333 17.5 13.3333Z" stroke="#667EEA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.83329 13.3333H2.49996C2.03972 13.3333 1.66663 13.7063 1.66663 14.1666V17.4999C1.66663 17.9602 2.03972 18.3333 2.49996 18.3333H5.83329C6.29353 18.3333 6.66663 17.9602 6.66663 17.4999V14.1666C6.66663 13.7063 6.29353 13.3333 5.83329 13.3333Z" stroke="#667EEA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.6667 1.66675H8.33333C7.8731 1.66675 7.5 2.03984 7.5 2.50008V5.83341C7.5 6.29365 7.8731 6.66675 8.33333 6.66675H11.6667C12.1269 6.66675 12.5 6.29365 12.5 5.83341V2.50008C12.5 2.03984 12.1269 1.66675 11.6667 1.66675Z" stroke="#667EEA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.16663 13.3333V10.8333C4.16663 10.6123 4.25442 10.4004 4.4107 10.2441C4.56698 10.0878 4.77895 10 4.99996 10H15C15.221 10 15.4329 10.0878 15.5892 10.2441C15.7455 10.4004 15.8333 10.6123 15.8333 10.8333V13.3333" stroke="#667EEA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 10.0001V6.66675" stroke="#667EEA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    id: 2,
    title: "Увеличить",
    gradient: "default",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 2H14V6" stroke="white" stroke-opacity="0.6" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 2L9.33337 6.66667" stroke="white" stroke-opacity="0.6" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2 13.9999L6.66667 9.33325" stroke="white" stroke-opacity="0.6" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 14H2V10" stroke="white" stroke-opacity="0.6" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
];
export const SmartSuggestionData = [
  {
    id: 1,
    title: "Умные предложения",
    gradient: "default",
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.18084 2.34488C9.21654 2.15372 9.31798 1.98106 9.46758 1.85681C9.61719 1.73256 9.80553 1.66455 10 1.66455C10.1945 1.66455 10.3828 1.73256 10.5324 1.85681C10.682 1.98106 10.7835 2.15372 10.8192 2.34488L11.695 6.97655C11.7572 7.30584 11.9172 7.60873 12.1542 7.84569C12.3912 8.08265 12.694 8.24267 13.0233 8.30488L17.655 9.18071C17.8462 9.21642 18.0188 9.31786 18.1431 9.46746C18.2673 9.61706 18.3353 9.80541 18.3353 9.99988C18.3353 10.1943 18.2673 10.3827 18.1431 10.5323C18.0188 10.6819 17.8462 10.7833 17.655 10.819L13.0233 11.6949C12.694 11.7571 12.3912 11.9171 12.1542 12.1541C11.9172 12.391 11.7572 12.6939 11.695 13.0232L10.8192 17.6549C10.7835 17.846 10.682 18.0187 10.5324 18.1429C10.3828 18.2672 10.1945 18.3352 10 18.3352C9.80553 18.3352 9.61719 18.2672 9.46758 18.1429C9.31798 18.0187 9.21654 17.846 9.18084 17.6549L8.305 13.0232C8.2428 12.6939 8.08277 12.391 7.84581 12.1541C7.60885 11.9171 7.30596 11.7571 6.97667 11.6949L2.345 10.819C2.15384 10.7833 1.98118 10.6819 1.85693 10.5323C1.73269 10.3827 1.66467 10.1943 1.66467 9.99988C1.66467 9.80541 1.73269 9.61706 1.85693 9.46746C1.98118 9.31786 2.15384 9.21642 2.345 9.18071L6.97667 8.30488C7.30596 8.24267 7.60885 8.08265 7.84581 7.84569C8.08277 7.60873 8.2428 7.30584 8.305 6.97655L9.18084 2.34488Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.6666 1.6665V4.99984" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.3333 3.3335H15" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.33329 18.3333C4.25377 18.3333 4.99996 17.5871 4.99996 16.6667C4.99996 15.7462 4.25377 15 3.33329 15C2.41282 15 1.66663 15.7462 1.66663 16.6667C1.66663 17.5871 2.41282 18.3333 3.33329 18.3333Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    id: 2,
    title: "Оптимизация",
    gradient: "blue",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.6666 4.6665H14.6666V8.6665" stroke="#667EEA" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.6667 4.6665L9.00004 10.3332L5.66671 6.99984L1.33337 11.3332" stroke="#667EEA" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    id: 3,
    title: "Документы",
    gradient: "blue",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.99996 14.6668C3.64634 14.6668 3.3072 14.5264 3.05715 14.2763C2.8071 14.0263 2.66663 13.6871 2.66663 13.3335V2.66683C2.66663 2.31321 2.8071 1.97407 3.05715 1.72402C3.3072 1.47397 3.64634 1.3335 3.99996 1.3335H9.33329C9.54433 1.33316 9.75335 1.37457 9.94831 1.45534C10.1433 1.53612 10.3203 1.65467 10.4693 1.80416L12.8613 4.19617C13.0112 4.34517 13.1301 4.5224 13.2111 4.71761C13.2921 4.91282 13.3336 5.12214 13.3333 5.3335V13.3335C13.3333 13.6871 13.1928 14.0263 12.9428 14.2763C12.6927 14.5264 12.3536 14.6668 12 14.6668H3.99996Z" stroke="#667EEA" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.33337 1.3335V4.66683C9.33337 4.84364 9.40361 5.01321 9.52864 5.13823C9.65366 5.26326 9.82323 5.3335 10 5.3335H13.3334" stroke="#667EEA" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.66671 6H5.33337" stroke="#667EEA" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.6667 8.6665H5.33337" stroke="#667EEA" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.6667 11.3335H5.33337" stroke="#667EEA" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    id: 4,
    title: "Команды",
    gradient: "blue",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.6667 14V12.6667C10.6667 11.9594 10.3858 11.2811 9.88566 10.781C9.38556 10.281 8.70728 10 8.00004 10H4.00004C3.2928 10 2.61452 10.281 2.11442 10.781C1.61433 11.2811 1.33337 11.9594 1.33337 12.6667V14" stroke="#667EEA" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.6666 2.08545C11.2385 2.2337 11.7449 2.56763 12.1064 3.03482C12.4679 3.50202 12.6641 4.07604 12.6641 4.66678C12.6641 5.25752 12.4679 5.83154 12.1064 6.29874C11.7449 6.76594 11.2385 7.09987 10.6666 7.24812" stroke="#667EEA" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.6666 13.9998V12.6664C14.6662 12.0756 14.4695 11.5016 14.1075 11.0346C13.7455 10.5677 13.2387 10.2341 12.6666 10.0864" stroke="#667EEA" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.00004 7.33333C7.4728 7.33333 8.66671 6.13943 8.66671 4.66667C8.66671 3.19391 7.4728 2 6.00004 2C4.52728 2 3.33337 3.19391 3.33337 4.66667C3.33337 6.13943 4.52728 7.33333 6.00004 7.33333Z" stroke="#667EEA" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    id: 5,
    title: "Проверка",
    gradient: "default",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 4V8L10.6667 9.33333" stroke="#667EEA" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.00004 14.6668C11.6819 14.6668 14.6667 11.6821 14.6667 8.00016C14.6667 4.31826 11.6819 1.3335 8.00004 1.3335C4.31814 1.3335 1.33337 4.31826 1.33337 8.00016C1.33337 11.6821 4.31814 14.6668 8.00004 14.6668Z" stroke="#667EEA" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
];
export const KnolageGraphData = [
  {
    id: 1,
    title: "Граф знаний",
    gradient: "blue",
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 5.83325V17.4999" stroke="white" stroke-opacity="0.6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.49996 15C2.27895 15 2.06698 14.9122 1.9107 14.7559C1.75442 14.5996 1.66663 14.3877 1.66663 14.1667V3.33333C1.66663 3.11232 1.75442 2.90036 1.9107 2.74408C2.06698 2.5878 2.27895 2.5 2.49996 2.5H6.66663C7.55068 2.5 8.39853 2.85119 9.02365 3.47631C9.64877 4.10143 9.99996 4.94928 9.99996 5.83333C9.99996 4.94928 10.3511 4.10143 10.9763 3.47631C11.6014 2.85119 12.4492 2.5 13.3333 2.5H17.5C17.721 2.5 17.9329 2.5878 18.0892 2.74408C18.2455 2.90036 18.3333 3.11232 18.3333 3.33333V14.1667C18.3333 14.3877 18.2455 14.5996 18.0892 14.7559C17.9329 14.9122 17.721 15 17.5 15H12.5C11.8369 15 11.201 15.2634 10.7322 15.7322C10.2634 16.2011 9.99996 16.837 9.99996 17.5C9.99996 16.837 9.73657 16.2011 9.26773 15.7322C8.79889 15.2634 8.163 15 7.49996 15H2.49996Z" stroke="white" stroke-opacity="0.6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    id: 2,
    title: "Быстрые фильтры",
    gradient: "default",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.39071 1.72416C8.14072 1.4741 7.80163 1.33357 7.44804 1.3335H2.66671C2.31309 1.3335 1.97395 1.47397 1.7239 1.72402C1.47385 1.97407 1.33337 2.31321 1.33337 2.66683V7.44816C1.33345 7.80176 1.47397 8.14084 1.72404 8.39083L7.52671 14.1935C7.82972 14.4946 8.23954 14.6636 8.66671 14.6636C9.09388 14.6636 9.5037 14.4946 9.80671 14.1935L14.1934 9.80683C14.4945 9.50382 14.6635 9.094 14.6635 8.66683C14.6635 8.23966 14.4945 7.82984 14.1934 7.52683L8.39071 1.72416Z" stroke="white" stroke-opacity="0.4" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.99996 5.33317C5.18405 5.33317 5.33329 5.18393 5.33329 4.99984C5.33329 4.81574 5.18405 4.6665 4.99996 4.6665C4.81586 4.6665 4.66663 4.81574 4.66663 4.99984C4.66663 5.18393 4.81586 5.33317 4.99996 5.33317Z" fill="white" fill-opacity="0.4" stroke="white" stroke-opacity="0.4" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
];
export const FlowDashboardData = [
  {
    id: 1,
    title: "Дашборд продуктивности",
    gradient: "default",
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.3333 9.99984H16.2666C15.9024 9.99906 15.548 10.1176 15.2576 10.3373C14.9671 10.557 14.7566 10.8658 14.6583 11.2165L12.7 18.1832C12.6873 18.2264 12.661 18.2645 12.625 18.2915C12.5889 18.3186 12.545 18.3332 12.5 18.3332C12.4549 18.3332 12.411 18.3186 12.375 18.2915C12.3389 18.2645 12.3126 18.2264 12.3 18.1832L7.69996 1.8165C7.68734 1.77323 7.66102 1.73522 7.62496 1.70817C7.5889 1.68112 7.54504 1.6665 7.49996 1.6665C7.45488 1.6665 7.41102 1.68112 7.37496 1.70817C7.3389 1.73522 7.31258 1.77323 7.29996 1.8165L5.34163 8.78317C5.24368 9.13247 5.03444 9.44027 4.74568 9.65985C4.45691 9.87943 4.10439 9.9988 3.74163 9.99984H1.66663" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    id: 2,
    title: "Время Фокуса",
    gradient: "orange",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.99999 13.9999C3.81076 14.0006 3.62522 13.9475 3.46495 13.8469C3.30467 13.7463 3.17623 13.6023 3.09454 13.4316C3.01286 13.2609 2.98129 13.0705 3.00349 12.8826C3.0257 12.6946 3.10077 12.5169 3.21999 12.3699L13.12 2.16992C13.1943 2.0842 13.2955 2.02628 13.407 2.00565C13.5185 1.98503 13.6337 2.00293 13.7337 2.05642C13.8337 2.10991 13.9126 2.19582 13.9573 2.30003C14.0021 2.40424 14.0101 2.52057 13.98 2.62992L12.06 8.64992C12.0034 8.80144 11.9844 8.96444 12.0046 9.12493C12.0248 9.28541 12.0837 9.4386 12.1761 9.57135C12.2685 9.70409 12.3918 9.81243 12.5353 9.88708C12.6788 9.96172 12.8382 10.0004 13 9.99992H20C20.1892 9.99927 20.3748 10.0523 20.535 10.1529C20.6953 10.2535 20.8238 10.3976 20.9054 10.5683C20.9871 10.739 21.0187 10.9293 20.9965 11.1173C20.9743 11.3052 20.8992 11.483 20.78 11.6299L10.88 21.8299C10.8057 21.9156 10.7045 21.9736 10.593 21.9942C10.4815 22.0148 10.3663 21.9969 10.2663 21.9434C10.1663 21.8899 10.0874 21.804 10.0427 21.6998C9.99791 21.5956 9.98991 21.4793 10.02 21.3699L11.94 15.3499C11.9966 15.1984 12.0156 15.0354 11.9954 14.8749C11.9752 14.7144 11.9163 14.5612 11.8239 14.4285C11.7315 14.2957 11.6082 14.1874 11.4647 14.1128C11.3212 14.0381 11.1617 13.9994 11 13.9999H3.99999Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    id: 3,
    title: "Завершенные задачи",
    gradient: "green",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.3334 4L6.00002 11.3333L2.66669 8" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    id: 4,
    title: "Продуктивность",
    gradient: "blue",
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.3334 5.83325H18.3334V10.8333" stroke="white" stroke-opacity="1" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.3333 5.83325L11.25 12.9166L7.08329 8.74992L1.66663 14.1666" stroke="white" stroke-opacity="1" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
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
