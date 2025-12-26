import React, { useState, useEffect } from "react";
import style from "../../style/Main/Hero.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
  // Дополнительные поля для детальной информации
  branches?: number;
  lastCommit?: string;
  urgentTasks?: number;
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
  const [heroProjects, setHeroProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    todayTasks: 0,
  });

  const user = useSelector(selectUser);

  // Загрузка проектов пользователя
  const fetchUserProjects = async (userId: number) => {
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

        // Рассчитываем статистику
        const totalProjects = projects.length;
        const activeProjects = projects.filter(
          (p) => p.status === "active"
        ).length;
        const completedProjects = projects.filter(
          (p) => p.status === "completed"
        ).length;
        const todayTasks = projects.reduce(
          (sum, p) => sum + (p.activeTasks || 0),
          0
        );

        setStats({
          totalProjects,
          activeProjects,
          completedProjects,
          todayTasks,
        });
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

  const handleProjectClick = (id: number) => {
    if (onProjectClick) {
      onProjectClick(id);
    }
  };

  const handleCreateTask = () => {
    // TODO: открыть модальное окно создания задачи
    console.log("Создать задачу");
  };

  const handleNewProject = () => {
    if (onNavigateToProjects) {
      onNavigateToProjects();
    }
  };

  // Quick actions данные
  const quickActions = [
    {
      id: 1,
      title: "Создать задачу",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      onClick: handleCreateTask,
      color: "#667EEA",
    },
    {
      id: 2,
      title: "Командный чат",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0034 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11499 17.053 3.99478 18.5291 5.47087C20.0052 6.94696 20.885 8.91565 21 11V11.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      onClick: () => console.log("Командный чат"),
      color: "#05DF72",
    },
    {
      id: 3,
      title: "Расписание",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="4"
            width="18"
            height="18"
            rx="2"
            ry="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="16"
            y1="2"
            x2="16"
            y2="6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="8"
            y1="2"
            x2="8"
            y2="6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="3"
            y1="10"
            x2="21"
            y2="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      onClick: () => console.log("Расписание"),
      color: "#FDC700",
    },
    {
      id: 4,
      title: "Все задачи",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 11L12 14L22 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      onClick: () => console.log("Все задачи"),
      color: "#FF8C42",
    },
  ];

  // Функция для получения цвета статуса
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "#05DF72";
      case "completed":
        return "#667EEA";
      case "pending":
        return "#FDC700";
      default:
        return "#667EEA";
    }
  };

  // Функция для получения текста статуса
  const getStatusText = (status?: string) => {
    switch (status) {
      case "active":
        return "Активный";
      case "completed":
        return "Завершен";
      case "pending":
        return "В ожидании";
      default:
        return "Неизвестно";
    }
  };

  return (
    <div className={style.dashboardHome}>
      {/* Header with account and notifications */}
      <header className={style.header}>
        <div className={style.topBar}>
          <div className={style.leftSection}>
            <div className={style.logo}>
              <h1 className={style.title}>Главная</h1>
            </div>
          </div>
          <div className={style.rightSection}>
            <div className={style.statusBlocksCompact}>
              <div className={style.projectsCount}>
                <span>{stats.totalProjects}</span> проектов
              </div>
              <div className={style.activeProjects}>
                <span>{stats.activeProjects}</span> активных
              </div>
              <div className={style.completedProjects}>
                <span>{stats.completedProjects}</span> завершено
              </div>
            </div>
            <div className={style.topButtons}>
              <button className={style.topButton} title="Уведомления">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.73 21a2 2 0 0 1-3.46 0"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className={style.userProfileHeader}>
                <div className={style.userAvatarHeader}>
                  <div className={style.avatarCircleHeader}>
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className={style.onlineIndicatorHeader}></div>
                </div>
                <div className={style.userInfoHeader}>
                  <div className={style.userNameHeader}>
                    {user?.name || "Пользователь"}
                  </div>
                  <div className={style.userPositionHeader}>
                    {user?.status || "Участник"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Create Project Button - top right under header */}
      <div className={style.createProjectSection}>
        <button
          className={style.createProjectButton}
          onClick={handleNewProject}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Создать проект
        </button>
      </div>

      {/* Hero Section - smaller */}
      <div className={style.heroSection}>
        <div className={style.heroContent}>
          <h1 className={style.heroTitle}>Обзор проектов</h1>
          <p className={style.heroSubtitle}>
            {stats.activeProjects} активный проект · {stats.todayTasks} задач
            сегодня
          </p>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className={style.quickActionsSection}>
        <h2 className={style.sectionTitle}>Быстрые действия</h2>
        <div className={style.quickActionsGrid}>
          {quickActions.map((action) => (
            <button
              key={action.id}
              className={style.quickActionCard}
              onClick={action.onClick}
              style={{ "--action-color": action.color } as React.CSSProperties}
            >
              <div className={style.quickActionIcon}>{action.icon}</div>
              <span className={style.quickActionTitle}>{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Projects Section */}
      <div className={style.projectsSection}>
        <div className={style.sectionHeader}>
          <h2 className={style.sectionTitle}>Активные проекты</h2>
          <button
            className={style.viewAllButton}
            onClick={onNavigateToProjects}
          >
            Смотреть все →
          </button>
        </div>

        {isLoading ? (
          <div className={style.loading}>
            <div className={style.spinner}></div>
            <p>Загрузка проектов...</p>
          </div>
        ) : heroProjects.length > 0 ? (
          <div className={style.projectsList}>
            {heroProjects.slice(0, 5).map((project) => (
              <div
                key={project.id}
                className={style.projectRow}
                onClick={() => handleProjectClick(project.id)}
              >
                <div className={style.projectInfo}>
                  <div className={style.projectMain}>
                    <h3 className={style.projectName}>{project.title}</h3>
                    <div className={style.projectMeta}>
                      <span
                        className={style.projectStatus}
                        style={{ color: getStatusColor(project.status) }}
                      >
                        <span
                          className={style.statusDot}
                          style={{
                            backgroundColor: getStatusColor(project.status),
                          }}
                        />
                        {getStatusText(project.status)}
                      </span>
                      {project.repository && (
                        <a
                          href={project.repository}
                          className={style.projectRepo}
                          onClick={(e) => e.stopPropagation()}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  <div className={style.projectDetails}>
                    <div className={style.projectDetail}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="9"
                          cy="7"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                      <span>
                        {project.users?.length || project.members || 0}{" "}
                        участников
                      </span>
                    </div>
                    <div className={style.projectDetail}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 11L12 14L22 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>
                        {project.activeTasks || project.tasks || 0} задач
                      </span>
                    </div>
                    <div className={style.projectDetail}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 6v6l4 2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>
                        {project.updated_at
                          ? new Date(project.updated_at).toLocaleDateString(
                              "ru-RU",
                              {
                                day: "numeric",
                                month: "short",
                              }
                            )
                          : "Недавно"}
                      </span>
                    </div>
                    {/* Ветки */}
                    <div className={style.projectDetail}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Ветки: {project.branches || 3}</span>
                    </div>
                    {/* Последний коммит */}
                    <div className={style.projectDetail}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>
                        Коммит: {project.lastCommit || "2 дня назад"}
                      </span>
                    </div>
                    {/* Горящие задачи */}
                    <div className={style.projectDetail}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M17.657 18.657A8 8 0 0 1 6.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0 1 20 13a7.975 7.975 0 0 1-2.343 5.657z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.879 16.121A3 3 0 1 0 12.12 13.88 3 3 0 0 0 9.88 16.12z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>
                        Горящие: {project.urgentTasks || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className={style.projectActionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProjectClick(project.id);
                  }}
                >
                  Открыть
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={style.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>Нет активных проектов</p>
            <button
              className={style.emptyStateButton}
              onClick={handleNewProject}
            >
              Создать первый проект
            </button>
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div className={style.analyticsSection}>
        <h2 className={style.sectionTitle}>Аналитика</h2>
        <div className={style.analyticsGrid}>
          <div className={style.analyticsCard}>
            <div className={style.analyticsCardHeader}>
              <h3 className={style.analyticsCardTitle}>Статистика проектов</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 20V10M18 20V4M6 20V16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={style.analyticsStats}>
              <div className={style.analyticsStat}>
                <span className={style.analyticsStatValue}>
                  {stats.totalProjects}
                </span>
                <span className={style.analyticsStatLabel}>Всего проектов</span>
              </div>
              <div className={style.analyticsStat}>
                <span
                  className={style.analyticsStatValue}
                  style={{ color: "#05DF72" }}
                >
                  {stats.activeProjects}
                </span>
                <span className={style.analyticsStatLabel}>Активных</span>
              </div>
              <div className={style.analyticsStat}>
                <span
                  className={style.analyticsStatValue}
                  style={{ color: "#667EEA" }}
                >
                  {stats.completedProjects}
                </span>
                <span className={style.analyticsStatLabel}>Завершено</span>
              </div>
            </div>
          </div>
          <div className={style.analyticsCard}>
            <div className={style.analyticsCardHeader}>
              <h3 className={style.analyticsCardTitle}>Последняя активность</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={style.recentActivity}>
              <div className={style.activityItem}>
                <div className={style.activityIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className={style.activityContent}>
                  <p className={style.activityText}>
                    Новая задача создана в проекте "Дизайн системы"
                  </p>
                  <span className={style.activityTime}>10 минут назад</span>
                </div>
              </div>
              <div className={style.activityItem}>
                <div className={style.activityIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 11L12 14L22 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className={style.activityContent}>
                  <p className={style.activityText}>
                    Задача "Обновить документацию" выполнена
                  </p>
                  <span className={style.activityTime}>1 час назад</span>
                </div>
              </div>
              <div className={style.activityItem}>
                <div className={style.activityIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="9"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div className={style.activityContent}>
                  <p className={style.activityText}>
                    Новый участник присоединился к команде
                  </p>
                  <span className={style.activityTime}>2 часа назад</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Hero);
