import React, { useState, useEffect } from "react";
import style from "../../style/Main/Hero.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user.js";
import Notifications from "../Common/Notifications";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface HeroProps {
  onNavigateToProjects?: () => void;
  onProjectClick?: (projectId: number) => void;
  projectRefreshKey?: number;
  onNavigateToProfile?: () => void;
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
  onNavigateToProfile,
}) => {
  const [heroProjects, setHeroProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    todayTasks: 0,
  });
  const [viewMode, setViewMode] = useState<"list" | "grid2" | "grid3">("list");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const user = useSelector(selectUser);
  const hasProjects = heroProjects.length > 0;

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

  // Загрузка статистики задач для проекта
  const fetchProjectTasks = async (projectId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/statistics`,
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
        return {
          total_tasks: 0,
          in_progress_tasks: 0,
          pending_tasks: 0,
          high_priority: 0,
        };
      }

      return data.task_statistics || {
        total_tasks: 0,
        in_progress_tasks: 0,
        pending_tasks: 0,
        high_priority: 0,
      };
    } catch (error) {
      console.error("Ошибка загрузки задач проекта:", error);
      return {
        total_tasks: 0,
        in_progress_tasks: 0,
        pending_tasks: 0,
        high_priority: 0,
      };
    }
  };

  // Загрузка последней активности
  const fetchRecentActivity = async (userId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/projects/activity/recent?user_id=${userId}&limit=3`,
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
        return [];
      }

      return data.activities || [];
    } catch (error) {
      console.error("Ошибка загрузки активности:", error);
      return [];
    }
  };

  // Загрузка GitHub репозиториев для проекта (по owner_id проекта)
  const fetchProjectGitHubRepos = async (ownerId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/github-projects/user/${ownerId}/projects`,
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
        return [];
      }

      // Обрабатываем как пагинированный ответ, так и обычный массив
      return data.data?.data || data.data || [];
    } catch (error) {
      console.error("Ошибка загрузки репозиториев:", error);
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

        // Загружаем статистику задач и GitHub репозитории для каждого проекта
        const projectsWithStats = await Promise.all(
          projects.map(async (project) => {
            const [taskStats, githubRepos] = await Promise.all([
              fetchProjectTasks(project.id),
              fetchProjectGitHubRepos(project.owner_id),
            ]);
            
            // Берем первый репозиторий владельца проекта (можно улучшить если будет связь project_id)
            const relatedRepo = githubRepos.length > 0 ? githubRepos[0] : null;

            // Форматируем дату последнего коммита
            let lastCommitFormatted = null;
            if (relatedRepo?.github_pushed_at) {
              const commitDate = new Date(relatedRepo.github_pushed_at);
              const now = new Date();
              const diffInDays = Math.floor(
                (now.getTime() - commitDate.getTime()) / (1000 * 60 * 60 * 24)
              );
              
              if (diffInDays === 0) {
                lastCommitFormatted = "Сегодня";
              } else if (diffInDays === 1) {
                lastCommitFormatted = "Вчера";
              } else if (diffInDays < 7) {
                lastCommitFormatted = `${diffInDays} дней назад`;
              } else {
                lastCommitFormatted = commitDate.toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "short",
                });
              }
            }

            return {
              ...project,
              status: project.status || "active",
              members: project.users?.length || 0,
              activeTasks: taskStats.in_progress_tasks || 0,
              tasks: taskStats.total_tasks || 0,
              urgentTasks: taskStats.high_priority || 0,
              repository: relatedRepo?.html_url || null,
              branches: relatedRepo?.default_branch ? 1 : 0, // Пока нет API для подсчета веток
              lastCommit: lastCommitFormatted,
            };
          })
        );

        setHeroProjects(projectsWithStats);

        // Рассчитываем статистику
        const totalProjects = projectsWithStats.length;
        const activeProjects = projectsWithStats.filter(
          (p) => p.status === "active"
        ).length;
        const completedProjects = projectsWithStats.filter(
          (p) => p.status === "completed"
        ).length;
        const todayTasks = projectsWithStats.reduce(
          (sum, p) => sum + (p.activeTasks || 0),
          0
        );

        setStats({
          totalProjects,
          activeProjects,
          completedProjects,
          todayTasks,
        });

        // Загружаем последнюю активность
        const activity = await fetchRecentActivity(user.id);
        setRecentActivity(activity);
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
              <button
                className={style.topButton}
                title="Уведомления"
                onClick={() => setNotificationsOpen(true)}
              >
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
              <div
                className={style.userProfileHeader}
                onClick={() => onNavigateToProfile && onNavigateToProfile()}
                style={{ cursor: onNavigateToProfile ? "pointer" : "default" }}
              >
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

      {/* Active Projects Section */}
      <div className={style.projectsSection}>
        <div className={style.sectionHeader}>
          <h2 className={style.sectionTitle}>Активные проекты</h2>
          <div className={style.viewControls}>
            <div className={style.viewModeButtons}>
              <button
                className={`${style.viewModeButton} ${
                  viewMode === "list" ? style.active : ""
                }`}
                onClick={() => setViewMode("list")}
                title="Список"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <button
                className={`${style.viewModeButton} ${
                  viewMode === "grid2" ? style.active : ""
                }`}
                onClick={() => setViewMode("grid2")}
                title="Сетка 2 колонки"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="9"
                    height="9"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="12"
                    y="3"
                    width="9"
                    height="9"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="3"
                    y="12"
                    width="9"
                    height="9"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="12"
                    y="12"
                    width="9"
                    height="9"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
              <button
                className={`${style.viewModeButton} ${
                  viewMode === "grid3" ? style.active : ""
                }`}
                onClick={() => setViewMode("grid3")}
                title="Сетка 3 колонки"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="2"
                    y="2"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="9"
                    y="2"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="16"
                    y="2"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="2"
                    y="9"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="9"
                    y="9"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="16"
                    y="9"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="2"
                    y="16"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="9"
                    y="16"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="16"
                    y="16"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
            <button
              className={style.viewAllButton}
              onClick={onNavigateToProjects}
            >
              Смотреть все →
            </button>
          </div>
        </div>


        {isLoading ? (
          <div className={style.loading}>
            <div className={style.spinner}></div>
            <p>Загрузка проектов...</p>
          </div>
        ) : heroProjects.length > 0 ? (
          <div
            className={`${style.projectsList} ${
              viewMode === "grid2"
                ? style.projectsGrid2
                : viewMode === "grid3"
                ? style.projectsGrid3
                : ""
            }`}
          >
            {heroProjects.slice(0, 5).map((project) => (
              <div
                key={project.id}
                className={style.projectRow}
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
                  {/* Детальная информация о проекте - компактная сетка */}
                  <div className={style.projectDetailGrid}>
                    {/* Быстрые действия - перенесены в информацию о проекте */}
                    {quickActions.map((action) => (
                      <button
                        key={action.id}
                        className={`${style.projectDetailCard} ${style.quickActionCard}`}
                        onClick={action.onClick}
                        style={
                          { "--action-color": action.color } as React.CSSProperties
                        }
                      >
                        <div className={style.quickActionIconWrapper}>
                          {action.icon}
                        </div>
                        <div className={style.projectDetailCardHeader}>
                          {action.title}
                        </div>
                      </button>
                    ))}
                    
                    {/* Команда */}
                    <div className={style.projectDetailCard}>
                      <div className={style.projectDetailCardHeader}>
                        <svg
                          width="10"
                          height="10"
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
                        Команда
                      </div>
                      <div className={style.projectDetailCardValue}>
                        {project.users?.length || project.members || 0}
                      </div>
                      <div className={style.teamAvatars}>
                        {project.users?.slice(0, 3).map((user, idx) => (
                          <div
                            key={user.id}
                            className={style.teamAvatar}
                            style={{ zIndex: 10 - idx }}
                          >
                            {user.name?.charAt(0) || "U"}
                          </div>
                        ))}
                        {project.users && project.users.length > 3 && (
                          <span className={style.teamMore}>
                            +{project.users.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* GitHub репозиторий */}
                    <div className={style.projectDetailCard}>
                      <div className={style.projectDetailCardHeader}>
                        <svg
                          width="10"
                          height="10"
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
                        Репозиторий
                      </div>
                      <div className={style.projectDetailCardValue}>
                        {project.repository ? "GitHub" : "Нет"}
                      </div>
                      <div className={style.projectDetailCardSub}>
                        {project.repository ? "Ссылка" : "Не подключен"}
                      </div>
                    </div>

                    {/* Ветки */}
                    <div className={style.projectDetailCard}>
                      <div className={style.projectDetailCardHeader}>
                        <svg
                          width="10"
                          height="10"
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
                        Ветки
                      </div>
                      <div className={style.projectDetailCardValue}>
                        {project.branches || 0}
                      </div>
                      <div className={style.projectDetailCardSub}>активные</div>
                    </div>

                    {/* Последний коммит */}
                    <div className={style.projectDetailCard}>
                      <div className={style.projectDetailCardHeader}>
                        <svg
                          width="10"
                          height="10"
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
                        Коммит
                      </div>
                      <div className={style.projectDetailCardValue}>
                        {project.lastCommit ? project.lastCommit : "Нет"}
                      </div>
                      <div className={style.projectDetailCardSub}>
                        {project.lastCommit ? "последний" : "нет данных"}
                      </div>
                    </div>

                    {/* Обновлен */}
                    <div className={style.projectDetailCard}>
                      <div className={style.projectDetailCardHeader}>
                        <svg
                          width="10"
                          height="10"
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
                        Обновлен
                      </div>
                      <div className={style.projectDetailCardValue}>
                        {project.updated_at
                          ? new Date(project.updated_at).toLocaleDateString(
                              "ru-RU",
                              {
                                day: "numeric",
                                month: "short",
                              }
                            )
                          : "Недавно"}
                      </div>
                      <div className={style.projectDetailCardSub}>
                        последнее
                      </div>
                    </div>

                    {/* Горящие задачи */}
                    <div className={style.projectDetailCard}>
                      <div className={style.projectDetailCardHeader}>
                        <svg
                          width="10"
                          height="10"
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
                        Горящие
                      </div>
                      <div className={style.projectDetailCardValue}>
                        {project.urgentTasks || 0}
                      </div>
                      <div className={style.projectDetailCardSub}>задачи</div>
                    </div>

                    {/* Активные задачи */}
                    <div className={style.projectDetailCard}>
                      <div className={style.projectDetailCardHeader}>
                        <svg
                          width="10"
                          height="10"
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
                        Задачи
                      </div>
                      <div className={style.projectDetailCardValue}>
                        {project.activeTasks || project.tasks || 0}
                      </div>
                      <div className={style.projectDetailCardSub}>всего</div>
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
            <div className={style.emptyStateContent}>
              <div className={style.emptyStateIcon}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="30" stroke="var(--color-primary-soft)" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M24 28L32 36L40 28" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="32" cy="24" r="2" fill="var(--color-primary)" />
                  <circle cx="32" cy="40" r="2" fill="var(--color-primary)" />
                </svg>
              </div>
              <h3 className={style.emptyStateTitle}>Нет активных проектов</h3>
              <p className={style.emptyStateSubtitle}>
                Создайте свой первый проект, чтобы начать работу и организовать задачи
              </p>
              <button className={style.emptyStateButton} onClick={handleNewProject}>
                Создать первый проект
              </button>
            </div>
            <div className={`${style.emptyStateDecoration} ${style.dot1}`}></div>
            <div className={`${style.emptyStateDecoration} ${style.dot2}`}></div>
            <div className={`${style.emptyStateDecoration} ${style.dot3}`}></div>
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
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => {
                  const getActivityIcon = () => {
                    switch (activity.type) {
                      case "task_created":
                        return (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 5V19M5 12H19"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        );
                      case "task_completed":
                        return (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M9 11L12 14L22 4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        );
                      case "member_added":
                        return (
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
                        );
                      default:
                        return (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        );
                    }
                  };

                  const formatTimeAgo = (dateString: string) => {
                    const date = new Date(dateString);
                    const now = new Date();
                    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

                    if (diffInSeconds < 60) {
                      return "только что";
                    } else if (diffInSeconds < 3600) {
                      const minutes = Math.floor(diffInSeconds / 60);
                      return `${minutes} ${minutes === 1 ? "минуту" : minutes < 5 ? "минуты" : "минут"} назад`;
                    } else if (diffInSeconds < 86400) {
                      const hours = Math.floor(diffInSeconds / 3600);
                      return `${hours} ${hours === 1 ? "час" : hours < 5 ? "часа" : "часов"} назад`;
                    } else {
                      const days = Math.floor(diffInSeconds / 86400);
                      return `${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"} назад`;
                    }
                  };

                  return (
                    <div key={index} className={style.activityItem}>
                      <div className={style.activityIcon}>
                        {getActivityIcon()}
                      </div>
                      <div className={style.activityContent}>
                        <p className={style.activityText}>
                          {activity.message}
                        </p>
                        <span className={style.activityTime}>
                          {formatTimeAgo(activity.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={style.activityItem}>
                  <div className={style.activityContent}>
                    <p className={style.activityText}>
                      Нет недавней активности
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Notifications
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
};

export default React.memo(Hero);
