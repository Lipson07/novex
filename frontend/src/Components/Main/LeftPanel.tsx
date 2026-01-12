import React, { useState, useEffect } from "react";
import style from "../../style/Main/LeftPanel.module.scss";
import { leftPanelIcons } from "../../assets/LeftPanel/index.js";
import { useSelector } from "react-redux";
import "../../App.scss";
import { selectUser } from "../../store/user.js";
import { ProjectService, formatDate } from "../../assets/MockData/index.js";

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
}

interface LeftPanelProps {
  onPageChange?: (page: string) => void;
  currentPage?:
    | "main"
    | "projects"
    | "project-detail"
    | "team-chat"
    | "schedule"
    | "quick-note"
    | "tasks"
    | "dashboard"
    | "settings"
    | "ai";
  onProjectClick?: (projectId: number) => void;
  activeProjectId?: number | null;
  projectRefreshKey?: number;
}

function LeftPanel({
  onPageChange,
  currentPage,
  onProjectClick,
  activeProjectId,
  projectRefreshKey = 0,
}: LeftPanelProps) {
  const user = useSelector(selectUser);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [isProjectsListCollapsed, setIsProjectsListCollapsed] = useState(false);
  const [isAIPanelCollapsed, setIsAIPanelCollapsed] = useState(true); // По умолчанию свернуто
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false); // Состояние свертывания всей панели
  const [isMobileExpanded, setIsMobileExpanded] = useState(false); // Состояние расширения на мобильных

  const categoryToPage: Record<string, string> = {
    Главная: "main",
    Проекты: "projects",
    Задания: "tasks",
    "Панель управления": "dashboard",
    Настройки: "settings",
    AI: "ai",
  };

  const pageToCategory: Record<string, string> = {
    main: "Главная",
    projects: "Проекты",
    "project-detail": "Проекты",
    "team-chat": "Проекты",
    schedule: "Проекты",
    "quick-note": "Проекты",
    tasks: "Задания",
    dashboard: "Панель управления",
    settings: "Настройки",
    ai: "AI",
  };

  useEffect(() => {
    if (activeProjectId && currentPage === "project-detail") {
      setIsProjectsListCollapsed(false);
    }
  }, [activeProjectId, currentPage]);

  useEffect(() => {
    if (!currentPage) return;
    const categoryName = pageToCategory[currentPage];
    if (!categoryName) return;

    const index = leftPanelIcons.findIndex(
      (icon) => icon.name === categoryName
    );
    if (index !== -1) {
      setActiveCategory(index);
    }
  }, [currentPage]);

  const suggestions = [
    "Обзор дорожной карты Q4",
    "Обновить документацию дизайн-системы",
    "Запланировать синхронизацию команды",
  ];

  const recentProjects = userProjects
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 3);

  useEffect(() => {
    fetchUserProjects();
  }, [projectRefreshKey]);

  const fetchUserProjects = async () => {
    try {
      setProjectsLoading(true);
      if (user?.id) {
        const projects = await ProjectService.getUserProjects(user.id);
        setUserProjects(projects);
      }
    } catch (error) {
      console.error("Ошибка загрузки проектов:", error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      console.log("Отправка сообщения ИИ:", chatMessage);
      setChatMessage("");
    }
  };

  const handleNewProject = () => {
    setIsModalOpen(true);
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Пожалуйста, введите название проекта");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const newProject = await ProjectService.createProject({
        tittle: title.trim(),
        description: description.trim(),
        owner_id: user?.id || 1,
      });

      console.log("Проект успешно создан:", newProject);
      await fetchUserProjects(); // Обновить список проектов
      closeModal();

      // Если есть callback для перехода на страницу проектов
      if (onPageChange) {
        onPageChange("projects");
      }
    } catch (error) {
      console.error("Ошибка создания проекта:", error);
      setError("Ошибка создания проекта");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (index: number, categoryName: string) => {
    setActiveCategory(index);

    // Закрываем мобильное меню при выборе категории
    if (isMobileExpanded) {
      setIsMobileExpanded(false);
    }

    if (onPageChange) {
      const nextPage = categoryToPage[categoryName] || "main";
      onPageChange(nextPage);
    }
  };

  const handleProjectClick = (projectId: number) => {
    console.log("Открыть проект из левой панели:", projectId);
    if (onProjectClick) {
      onProjectClick(projectId);
    }
  };

  const handleViewAllProjects = () => {
    if (onPageChange) {
      onPageChange("projects");
      const projectsIndex = leftPanelIcons.findIndex(
        (icon) => icon.name === "Проекты"
      );
      if (projectsIndex !== -1) {
        setActiveCategory(projectsIndex);
      }
    }
  };

  const toggleAIPanel = () => {
    setIsAIPanelCollapsed(!isAIPanelCollapsed);
  };

  const togglePanelCollapsed = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  const toggleMobileExpanded = () => {
    setIsMobileExpanded(!isMobileExpanded);
  };

  return (
    <>
      <div
        className={`${style.main} ${isPanelCollapsed ? style.collapsed : ""} ${
          style.mobileHeader
        } ${isMobileExpanded ? style.mobileExpanded : ""}`}
      >
        <div className={style.header}>
          <div className={style.naming}>
            <div className={style.svgbox}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={{ marginRight: "5px", verticalAlign: "middle" }}
              >
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
            </div>
            <div className={style.namingtxt}>
              <h1 className={style.namingh1}>Novex</h1>
            </div>

            {/* Кнопка закрытия для расширенного мобильного меню */}
            {isMobileExpanded && (
              <button
                className={style.mobileCloseButton}
                onClick={toggleMobileExpanded}
                title="Закрыть меню"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            className={style.collapseToggleButton}
            onClick={
              isMobileExpanded ? toggleMobileExpanded : togglePanelCollapsed
            }
            title={
              isMobileExpanded
                ? "Закрыть меню"
                : isPanelCollapsed
                ? "Развернуть панель"
                : "Свернуть панель"
            }
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={isPanelCollapsed ? style.collapsedIcon : ""}
            >
              <path
                d={
                  isMobileExpanded
                    ? "M6 18L18 6M6 6l12 12"
                    : isPanelCollapsed
                    ? "M9 18l6-6-6-6"
                    : "M15 18l-6-6 6-6"
                }
              />
            </svg>
          </button>
        </div>

        <div className={style.category}>
          {leftPanelIcons.map((element, index) => {
            if (element.name === "Проекты") {
              return (
                <div
                  key={element.name}
                  className={style.projectsCategoryContainer}
                >
                  <div
                    className={`${style.categoryItem} ${
                      activeCategory === index ? style.active : ""
                    }`}
                    onClick={() => handleCategoryClick(index, element.name)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d={element.icon} />
                    </svg>

                    <p>{element.name}</p>
                    <div
                      className={style.projectsListTitle}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsProjectsListCollapsed(!isProjectsListCollapsed);
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`${style.collapseIcon} ${
                          isProjectsListCollapsed ? style.collapsed : ""
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>

                  <div className={style.projectsListSection}>
                    {!isProjectsListCollapsed && (
                      <>
                        {projectsLoading ? (
                          <div className={style.projectsLoading}>
                            Загрузка проектов...
                          </div>
                        ) : recentProjects.length === 0 ? (
                          <div className={style.projectsEmpty}>
                            Нет проектов
                          </div>
                        ) : (
                          <>
                            {recentProjects.map((project) => (
                              <div
                                key={project.id}
                                className={`${style.projectListItem} ${
                                  activeProjectId === project.id &&
                                  currentPage === "project-detail"
                                    ? style.active
                                    : ""
                                }`}
                                onClick={() => handleProjectClick(project.id)}
                              >
                                <div className={style.projectIcon}>
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                  </svg>
                                </div>
                                <div className={style.projectInfo}>
                                  <div className={style.projectTitle}>
                                    {project.title}
                                  </div>
                                  <div className={style.projectDate}>
                                    {formatDate(project.created_at)}
                                  </div>
                                </div>
                              </div>
                            ))}

                            {userProjects.length > 3 && (
                              <div className={style.projectsMore}>
                                И еще {userProjects.length - 3} проектов
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={element.name}
                className={`${style.categoryItem} ${
                  activeCategory === index ? style.active : ""
                }`}
                onClick={() => handleCategoryClick(index, element.name)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d={element.icon} />
                </svg>
                <p>{element.name}</p>
              </div>
            );
          })}
        </div>

        <div className={style.suggestions}>
          <div
            className={`${style.glassCard} ${
              isAIPanelCollapsed ? style.collapsed : ""
            }`}
          >
            <div
              className={style.cardHeader}
              onClick={toggleAIPanel}
              style={{ cursor: "pointer" }}
            >
              <div className={style.aiIdentity}>
                <div className={style.aiIcon}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className={style.aiInfo}>
                  <div className={style.aiName}>AI</div>
                  <div className={style.aiStatus}>
                    <div className={style.statusDot}></div>
                    <span>Всегда учится</span>
                  </div>
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`${style.collapseIcon} ${
                    isAIPanelCollapsed ? style.collapsed : ""
                  }`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            {!isAIPanelCollapsed && (
              <>
                <div className={style.cardContent}>
                  <div className={style.suggestionsTitle}>
                    Умные предложения
                  </div>

                  <div className={style.suggestionsList}>
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className={style.suggestionItem}>
                        <div className={style.suggestionIcon}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </div>
                        <span className={style.suggestionText}>
                          {suggestion}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={handleChatSubmit}
                  className={style.chatInputContainer}
                >
                  <div className={style.chatInputWrapper}>
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Спросите Synapse AI..."
                      className={style.chatInput}
                      maxLength={100}
                    />
                    <button
                      type="submit"
                      className={style.chatSendButton}
                      disabled={!chatMessage.trim()}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(LeftPanel);
