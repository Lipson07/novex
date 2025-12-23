import React, { useState, useEffect } from "react";
import style from "../../style/Main/Hero.module.scss";
import { HeroIcons } from "../../assets/LeftPanel/index.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user.js";
import {
  formatDeadlineDate,
  getPriorityColor,
  getStatusText,
  getStatusColor,
} from "../../assets/MockData/index.js";

interface HeroProps {
  onNavigateToProjects?: () => void;
  onProjectClick?: (projectId: number) => void;
  projectRefreshKey?: number;
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
  repository?: string;
  activeTasks?: number;
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

const Hero: React.FC<HeroProps> = ({
  onNavigateToProjects,
  onProjectClick,
  projectRefreshKey,
}) => {
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedSections, setCollapsedSections] = useState<{
    projects: boolean;
    team: boolean;
    deadlines: boolean;
    quickAccess: boolean;
  }>({
    projects: false,
    team: false,
    deadlines: false,
    quickAccess: false,
  });

  const [statusBlocks, setStatusBlocks] = useState<any[]>([]);
  const [heroProjects, setHeroProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const user = useSelector(selectUser);

  // Загрузка проектов пользователя
  const fetchUserProjects = async (userId: number) => {
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

      return data.projects || [];
    } catch (error) {
      console.error("Ошибка загрузки проектов:", error);
      return [];
    }
  };

  // Загрузка данных для Hero
  const loadHeroData = async () => {
    if (user?.id) {
      try {
        setIsLoading(true);

        // Загружаем проекты пользователя
        const projects = await fetchUserProjects(user.id);
        setHeroProjects(projects);

        // Создаем статус блоки на основе проектов
        const totalProjects = projects.length;
        const activeProjects = projects.filter(
          (p) => p.status === "active"
        ).length;
        const completedProjects = projects.filter(
          (p) => p.status === "completed"
        ).length;

        setStatusBlocks([
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
        ]);

        // Получаем участников первого проекта (если есть)
        if (projects.length > 0) {
          const firstProject = projects[0];
          const members = firstProject.users || [];
          setTeamMembers(
            members.map((member: User) => ({
              id: member.id,
              name: member.name,
              email: member.email,
              avatar: member.name?.charAt(0) || "П",
              role: "Участник",
              online: true,
            }))
          );
        }

        // Устанавливаем текущего пользователя
        setCurrentUser({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.name?.charAt(0) || "П",
          position: "",
          department: "",
          status: "active",
          online: true,
        });

        // Дедлайны пока оставляем пустыми (нет endpoint)
        setDeadlines([]);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadHeroData();
  }, [user?.id, projectRefreshKey]);

  // Функция для обработки клика по иконкам в header
  const handleTopButtonClick = (iconName: string) => {
    if (iconName === "notifications") {
      setIsActivityModalOpen(true);
    } else {
      console.log(`Нажата иконка: ${iconName}`);
      // Обработка других иконок
    }
  };

  // Функция для закрытия модального окна
  const closeActivityModal = () => {
    setIsActivityModalOpen(false);
  };

  const handleProjectClick = (id: number) => {
    if (onProjectClick) {
      onProjectClick(id);
    }
  };

  const handleViewAllClick = () => {
    console.log("Переход на страницу проектов");
    if (onNavigateToProjects) {
      onNavigateToProjects();
    }
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Получаем информацию о текущем пользователе
  const userData = currentUser || {
    id: user?.id || 1,
    name: user?.name || "Пользователь",
    email: user?.email || "",
    avatar: user?.name?.charAt(0) || "П",
    position: "",
    department: "",
    status: "active",
    online: true,
  };

  // Получаем команду для первого активного проекта
  const activeProject = heroProjects[0];

  // Получаем ближайшие дедлайны (исключая завершенные)
  const upcomingDeadlines = deadlines.filter((d) => d.status !== "completed");

  const renderStatusBlock = (block: any) => (
    <div key={block.id} className={style[block.className]}>
      <span>{block.text}</span>
      {block.hasDot && <span className={style.dot}>●</span>}
      {block.value}
    </div>
  );

  const renderProjectCard = (project: Project) => {
    // Генерируем название репозитория на основе названия проекта
    const repositoryName =
      project.repository ||
      `github.com/org/${project.title?.toLowerCase().replace(/\s+/g, "-")}`;
    const activeTasksCount =
      project.activeTasks !== undefined
        ? project.activeTasks
        : project.tasks
        ? Math.floor(project.tasks * 0.6)
        : 0;

    return (
      <div
        key={project.id}
        className={style.projectCard}
        onClick={() => handleProjectClick(project.id)}
      >
        <div className={style.projectHeader}>
          <div className={style.projectName}>
            <h3>{project.title}</h3>
            <span
              className={
                project.status === "active"
                  ? style.statusActive
                  : style.statusReview
              }
              style={{
                backgroundColor: `${getStatusColor(project.status)}20`,
                color: getStatusColor(project.status),
              }}
            >
              {getStatusText(project.status)}
            </span>
          </div>
        </div>

        {/* Краткая информация о проекте */}
        <div className={style.projectInfo}>
          {/* Название репозитория */}
          <div className={style.infoRow}>
            <div className={style.infoIcon}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </div>
            <div className={style.infoContent}>
              <span className={style.infoLabel}>Репозиторий</span>
              <span className={style.infoValue}>{repositoryName}</span>
            </div>
          </div>

          {/* Количество людей */}
          <div className={style.infoRow}>
            <div className={style.infoIcon}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className={style.infoContent}>
              <span className={style.infoLabel}>Участников</span>
              <span className={style.infoValue}>
                {project.users?.length || project.members || 0}
              </span>
            </div>
          </div>

          {/* Количество активных задач */}
          <div className={style.infoRow}>
            <div className={style.infoIcon}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <div className={style.infoContent}>
              <span className={style.infoLabel}>Активных задач</span>
              <span className={style.infoValue}>{activeTasksCount}</span>
            </div>
          </div>

          {/* Дополнительная информация для улучшения UX/UI */}
          {project.progress !== undefined && (
            <div className={style.infoRow}>
              <div className={style.infoIcon}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.66667"
                >
                  <path d="M13.3334 5.83325H18.3334V10.8333" />
                  <path d="M18.3333 5.83325L11.25 12.9166L7.08329 8.74992L1.66663 14.1666" />
                </svg>
              </div>
              <div className={style.infoContent}>
                <span className={style.infoLabel}>Прогресс</span>
                <span className={style.infoValue}>{project.progress}%</span>
              </div>
            </div>
          )}

          {project.updated_at && (
            <div className={style.infoRow}>
              <div className={style.infoIcon}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div className={style.infoContent}>
                <span className={style.infoLabel}>Обновлен</span>
                <span className={style.infoValue}>
                  {new Date(project.updated_at).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActivityItem = (activity: any) => (
    <div key={activity.id} className={style.activityItem}>
      <div className={style.avatar}>{activity.avatar}</div>
      <div className={style.activityContent}>
        <p>{activity.text}</p>
        <span>{activity.time}</span>
      </div>
    </div>
  );

  // Рендер участника команды
  const renderTeamMember = (member: any) => (
    <div key={member.id} className={style.teamMember}>
      <div className={style.memberAvatar}>
        <div className={style.avatarCircle}>{member.avatar}</div>
        {member.online && <div className={style.onlineIndicator} />}
      </div>
      <div className={style.memberInfo}>
        <span className={style.memberName}>{member.name}</span>
        <span className={style.memberRole}>{member.role}</span>
      </div>
    </div>
  );

  // Рендер дедлайна
  const renderDeadline = (deadline: any) => {
    const deadlineDate = new Date(deadline.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysUntil = Math.ceil(
      (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const isUrgent = daysUntil <= 1;
    const isSoon = daysUntil <= 3 && daysUntil > 1;

    return (
      <div
        key={deadline.id}
        className={`${style.deadlineItem} ${isUrgent ? style.urgent : ""} ${
          isSoon ? style.soon : ""
        }`}
      >
        <div
          className={style.deadlineDate}
          style={{
            backgroundColor: `${getPriorityColor(deadline.priority)}20`,
            borderColor: `${getPriorityColor(deadline.priority)}30`,
          }}
        >
          {formatDeadlineDate(deadline.date)}
        </div>
        <div className={style.deadlineInfo}>
          <div className={style.deadlineTitleRow}>
            <span className={style.deadlineTitle}>{deadline.title}</span>
            {isUrgent && (
              <span className={style.urgentBadge}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Срочно
              </span>
            )}
          </div>
          <div className={style.deadlineMeta}>
            <span
              className={style.deadlinePriority}
              style={{ color: getPriorityColor(deadline.priority) }}
            >
              {deadline.priority === "high"
                ? "Высокий"
                : deadline.priority === "medium"
                ? "Средний"
                : "Низкий"}
            </span>
            {daysUntil >= 0 && (
              <span className={style.deadlineDays}>
                {daysUntil === 0
                  ? "Сегодня"
                  : daysUntil === 1
                  ? "Завтра"
                  : `Через ${daysUntil} дн.`}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Рендер быстрого доступа
  const statIcons = {
    members: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
    tasks: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 4L12 14.01l-3-3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  const sectionIcons = {
    projects: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="#667EEA" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="#667EEA" strokeWidth="2" />
      </svg>
    ),
    activity: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="#667EEA" strokeWidth="2" />
        <path
          d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20"
          stroke="#667EEA"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    team: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
          stroke="#667EEA"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="7" r="4" stroke="#667EEA" strokeWidth="2" />
        <path
          d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
          stroke="#667EEA"
          strokeWidth="2"
        />
      </svg>
    ),
    deadlines: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="4"
          width="18"
          height="18"
          rx="2"
          ry="2"
          stroke="#667EEA"
          strokeWidth="2"
        />
        <line
          x1="16"
          y1="2"
          x2="16"
          y2="6"
          stroke="#667EEA"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="2"
          x2="8"
          y2="6"
          stroke="#667EEA"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="3"
          y1="10"
          x2="21"
          y2="10"
          stroke="#667EEA"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    quickAccess: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          stroke="#667EEA"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="3" stroke="#667EEA" strokeWidth="2" />
      </svg>
    ),
  };

  // Данные для активности (константы, так как нет API)
  const activitiesData = [
    {
      id: 1,
      avatar: "АИ",
      text: "Алексей Иванов создал новый проект",
      time: "10 минут назад",
    },
    {
      id: 2,
      avatar: "МП",
      text: "Мария Петрова обновила дизайн",
      time: "30 минут назад",
    },
    {
      id: 3,
      avatar: "ДС",
      text: "Дмитрий Сидоров завершил задачу",
      time: "1 час назад",
    },
  ];

  return (
    <>
      <div className={style.container}>
        <header className={style.header}>
          <div className={style.topBar}>
            <div className={style.leftSection}>
              {/* Поиск */}
              <div className={style.searchBar}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  className={style.searchIcon}
                >
                  <path
                    d="M6 0C9.3136 1.28863e-07 11.9998 2.68644 12 6C12 7.41644 11.5074 8.7168 10.6865 9.74316L13.1377 12.1953C13.398 12.4557 13.398 12.8773 13.1377 13.1377C12.8773 13.398 12.4557 13.398 12.1953 13.1377L9.74316 10.6865C8.7168 11.5074 7.41644 12 6 12C2.68644 11.9998 1.28867e-07 9.3136 0 6C0.000175991 2.68655 2.68655 0.000175988 6 0ZM6 1.33398C3.42293 1.33416 1.33416 3.42293 1.33398 6C1.33398 8.57722 3.42282 10.6668 6 10.667C8.57733 10.667 10.667 8.57733 10.667 6C10.6668 3.42282 8.57722 1.33398 6 1.33398Z"
                    fill="currentColor"
                    fillOpacity="0.4"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Поиск"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={style.searchInput}
                />
                {searchQuery && (
                  <button
                    className={style.searchClear}
                    onClick={() => setSearchQuery("")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Правая часть: кнопки и профиль */}
            <div className={style.rightSection}>
              {/* Статус-блоки (компактные) */}
              <div className={style.statusBlocksCompact}>
                {statusBlocks.map(renderStatusBlock)}
              </div>

              {/* Кнопки действий */}
              <div className={style.topButtons}>
                {HeroIcons.filter((icon) => icon.name !== "profile").map(
                  (icon) => (
                    <button
                      key={icon.name}
                      className={style.topButton}
                      onClick={() => handleTopButtonClick(icon.name)}
                      title={
                        icon.name === "notifications"
                          ? "Уведомления"
                          : icon.name === "settings"
                          ? "Настройки"
                          : ""
                      }
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d={icon.icon}
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )
                )}
              </div>

              {/* Информация о пользователе */}
              <div className={style.userProfileHeader}>
                <div className={style.userAvatarHeader}>
                  <div className={style.avatarCircleHeader}>
                    {userData.avatar}
                  </div>
                  {userData.online && (
                    <div className={style.onlineIndicatorHeader} />
                  )}
                </div>
                <div className={style.userInfoHeader}>
                  <span className={style.userNameHeader}>{userData.name}</span>
                  <span className={style.userPositionHeader}>
                    {userData.position
                      ? userData.position
                      : "Должность не указана"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Основной контент - группировка секций */}
        <div className={style.mainContent}>
          {/* Группа: Проекты и команда */}
          <div className={style.projectsGroup}>
            {/* Секция активных проектов */}
            <div className={style.projectsSection}>
              <div className={style.sectionHeader}>
                <div
                  className={style.sectionTitle}
                  onClick={() => toggleSection("projects")}
                >
                  {sectionIcons.projects}
                  <h2>Активные проекты</h2>
                  <button
                    className={style.collapseButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection("projects");
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`${style.collapseIcon} ${
                        collapsedSections.projects ? style.collapsed : ""
                      }`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>
                <button
                  className={style.viewAll}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewAllClick();
                  }}
                >
                  Смотреть все →
                </button>
              </div>

              {!collapsedSections.projects && (
                <div className={style.projectCards}>
                  {isLoading ? (
                    <div className={style.loading}>
                      <div className={style.spinner}></div>
                      <p>Загрузка проектов...</p>
                    </div>
                  ) : heroProjects.length > 0 ? (
                    heroProjects.map(renderProjectCard)
                  ) : (
                    <div className={style.noProjects}>
                      <p>Нет активных проектов</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Группа: Дедлайны и аналитика */}
          <div className={style.secondaryGroup}>
            {/* Секция ближайших дедлайнов */}
            {upcomingDeadlines.length > 0 && (
              <div className={style.deadlinesSection}>
                <div
                  className={style.sectionHeader}
                  onClick={() => toggleSection("deadlines")}
                >
                  <div className={style.sectionTitle}>
                    {sectionIcons.deadlines}
                    <h2>Ближайшие дедлайны</h2>
                    <button className={style.collapseButton}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`${style.collapseIcon} ${
                          collapsedSections.deadlines ? style.collapsed : ""
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                  <span className={style.deadlinesCount}>
                    {upcomingDeadlines.length}
                  </span>
                </div>
                {!collapsedSections.deadlines && (
                  <div className={style.deadlinesList}>
                    {upcomingDeadlines.map(renderDeadline)}
                  </div>
                )}
              </div>
            )}

            {/* Аналитика и отчет по проектам */}
            <div className={style.quickAccessSection}>
              <div className={style.sectionHeader}>
                <div className={style.sectionTitle}>
                  {sectionIcons.activity}
                  <h2>Аналитика и отчеты</h2>
                </div>
              </div>
              <div className={style.analyticsGrid}>
                <div className={style.analyticsCard}>
                  <div className={style.analyticsTitle}>Аналитика</div>
                  <p className={style.analyticsText}>
                    Активных проектов: {statusBlocks[1]?.value ?? 0}. Завершено:{" "}
                    {statusBlocks[2]?.value ?? 0}. Всего:{" "}
                    {statusBlocks[0]?.value ?? 0}.
                  </p>
                </div>
                <div className={style.analyticsCard}>
                  <div className={style.analyticsTitle}>Отчет</div>
                  <p className={style.analyticsText}>
                    Краткий отчет сформирован по текущим проектам. Проверьте
                    задачи и статусы перед планированием спринта.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно активности */}
      {isActivityModalOpen && (
        <div className={style.modalOverlay} onClick={closeActivityModal}>
          <div
            className={style.activityModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={style.modalHeader}>
              <div className={style.modalTitle}>
                {sectionIcons.activity}
                <h2>Недавняя активность</h2>
              </div>
              <button
                className={style.closeButton}
                onClick={closeActivityModal}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className={style.modalActivityList}>
              {activitiesData.map(renderActivityItem)}
            </div>

            <div className={style.modalFooter}>
              <button className={style.viewAllBtn} onClick={handleViewAllClick}>
                Показать всю активность
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Hero);
