import React, { useState, useEffect, useRef } from "react";
import style from "../../style/Main/LeftPanel.module.scss";
import { leftPanelIcons } from "../../assets/LeftPanel/index.js";
import { useSelector } from "react-redux";
import "../../App.scss";
import { selectUser } from "../../store/user.js";
import { ProjectService, formatDate } from "../../assets/MockData/index.js";
import { themes as themesMap, themeNames } from "../../assets/LeftPanel/themes";

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
  const [tittle, setTittle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [isProjectsListCollapsed, setIsProjectsListCollapsed] = useState(false);
  const [isAIPanelCollapsed, setIsAIPanelCollapsed] = useState(true); // По умолчанию свернуто

  // Список доступных тем (берём из src/assets/LeftPanel/themes.ts)
  const themes = [...themeNames];

  // Функция для получения основных цветов темы для предпросмотра
  const getThemePreviewColors = (themeName: string): string[] => {
    const theme = themesMap[themeName];
    if (!theme) return [];
    // Возьмем основные цвета для предпросмотра
    const colors = [
      theme['bg-primary'],
      theme['accent-primary'],
      theme['accent-secondary'],
      theme['border-primary'],
    ].filter(Boolean);
    return colors.slice(0, 4); // максимум 4 цвета
  };

  // Выбранная тема (инициализация из localStorage)
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    try {
      return localStorage.getItem("theme") || "";
    } catch {
      return "";
    }
  });
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement | null>(null);
  const currentThemeLabel = selectedTheme || "По умолчанию";

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
    fetchUserProjects();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTittle("");
    setDescription("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tittle.trim()) {
      setError("Пожалуйста, введите название проекта");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const newProject = await ProjectService.createProject({
        tittle: tittle.trim(),
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

  const toggleTheme = () => {
    setIsThemeMenuOpen((s) => !s);
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    setIsThemeMenuOpen(false);
  };

  useEffect(() => {
    try {
      // Удаляем существующие theme-* классы
      Array.from(document.body.classList)
        .filter(
          (c): c is string => typeof c === "string" && c.startsWith("theme-")
        )
        .forEach((c) => document.body.classList.remove(c));

      if (selectedTheme) {
        // Добавляем класс вида theme-<name> — классы и переменные определены в src/style/Main/_variables.module.scss
        document.body.classList.add(`theme-${selectedTheme}`);

        // Сохраняем и дублируем в data-theme для совместимости
        document.body.setAttribute("data-theme", selectedTheme);
        localStorage.setItem("theme", selectedTheme);

        // Отладочный лог
        // eslint-disable-next-line no-console
        console.log("[Theme] applied", selectedTheme);
      } else {
        // Убираем data-theme
        document.body.removeAttribute("data-theme");
        localStorage.removeItem("theme");

        // Отладочный лог
        // eslint-disable-next-line no-console
        console.log("[Theme] cleared");
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[Theme] apply error", e);
    }

    // Синхронизируем старое булево состояние dark, если где-то используется
    setIsDarkMode(!!selectedTheme && selectedTheme.includes("dark"));
  }, [selectedTheme]);

  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        isThemeMenuOpen &&
        themeMenuRef.current &&
        !themeMenuRef.current.contains(e.target as Node)
      ) {
        setIsThemeMenuOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (isThemeMenuOpen && e.key === "Escape") {
        setIsThemeMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [isThemeMenuOpen]);

  return (
    <>
      <div className={style.main}>
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
          </div>
          <div className={style.searchcont}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 0C9.3136 1.28863e-07 11.9998 2.68644 12 6C12 7.41644 11.5074 8.7168 10.6865 9.74316L13.1377 12.1953C13.398 12.4557 13.398 12.8773 13.1377 13.1377C12.8773 13.398 12.4557 13.398 12.1953 13.1377L9.74316 10.6865C8.7168 11.5074 7.41644 12 6 12C2.68644 11.9998 1.28867e-07 9.3136 0 6C0.000175991 2.68655 2.68655 0.000175988 6 0ZM6 1.33398C3.42293 1.33416 1.33416 3.42293 1.33398 6C1.33398 8.57722 3.42282 10.6668 6 10.667C8.57733 10.667 10.667 8.57733 10.667 6C10.6668 3.42282 8.57722 1.33398 6 1.33398Z"
                fill="white"
                fillOpacity="0.4"
              />
            </svg>
            <input type="text" placeholder="Поиск" />
          </div>
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
                    <button
                      className={style.addProjectBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNewProject();
                      }}
                      title="Создать новый проект"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </div>

                  <div className={style.projectsListSection}>
                    <div
                      className={style.projectsListTitle}
                      onClick={() =>
                        setIsProjectsListCollapsed(!isProjectsListCollapsed)
                      }
                    >
                      <span>Последние проекты</span>
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

            // Специальная обработка кнопки Тема — показываем меню выбора темы
            if (element.name === "Тема") {
              return (
                <div
                  key={element.name}
                  className={`${style.categoryItem} ${
                    selectedTheme ? style.active : ""
                  }`}
                  title="Выбрать тему"
                  ref={themeMenuRef}
                >
                  <div
                    className={style.themeToggle}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTheme();
                    }}
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
                    <span className={style.themeName}>{currentThemeLabel}</span>

                    {isThemeMenuOpen && (
                      <div className={style.themeDropdown} role="menu">
                        {themes.map((t) => {
                          const previewColors = getThemePreviewColors(t);
                          return (
                            <button
                              key={t}
                              type="button"
                              className={`${style.themeItem} ${
                                selectedTheme === t ? style.themeActive : ""
                              }`}
                              onClick={(ev) => {
                                ev.stopPropagation();
                                handleThemeChange(t);
                              }}
                            >
                              <span>{t}</span>
                              {previewColors.length > 0 && (
                                <div className={style.themeColorPreview}>
                                  {previewColors.map((color, idx) => (
                                    <div
                                      key={idx}
                                      className={style.themeColorDot}
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
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

      {/* Модальное окно создания проекта */}
      {isModalOpen && (
        <div className={style.modalOverlay} onClick={closeModal}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <h3>Создать новый проект</h3>
              <button onClick={closeModal} className={style.closeButton}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className={style.modalForm}>
              {error && <div className={style.formError}>{error}</div>}

              <div className={style.formGroup}>
                <label>Название проекта *</label>
                <input
                  type="text"
                  value={tittle}
                  onChange={(e) => {
                    setTittle(e.target.value);
                    setError("");
                  }}
                  placeholder="Введите название проекта"
                  className={style.formInput}
                  required
                  autoFocus
                />
              </div>

              <div className={style.formGroup}>
                <label>Описание</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишите ваш проект..."
                  rows={4}
                  className={style.formTextarea}
                />
              </div>

              <div className={style.projectsSection}>
                <div className={style.projectsHeader}>
                  <label>Ваши проекты ({userProjects.length})</label>
                  {onPageChange && (
                    <button
                      type="button"
                      onClick={() => {
                        onPageChange("projects");
                        closeModal();
                      }}
                      className={style.viewAllProjectsBtn}
                    >
                      <span>Все проекты</span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5 12h14M12 5l7 7-7 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {projectsLoading ? (
                  <div className={style.projectsLoading}>
                    Загрузка проектов...
                  </div>
                ) : userProjects.length === 0 ? (
                  <div className={style.projectsEmpty}>
                    У вас еще нет проектов. Создайте первый!
                  </div>
                ) : (
                  <div className={style.projectsList}>
                    {recentProjects.map((project) => (
                      <div
                        key={project.id}
                        className={style.projectItem}
                        onClick={() => handleProjectClick(project.id)}
                      >
                        <div className={style.projectItemHeader}>
                          <div className={style.projectItemTitle}>
                            {project.title}
                          </div>
                          <div className={style.projectItemDate}>
                            {formatDate(project.created_at)}
                          </div>
                        </div>
                        {project.description && (
                          <div className={style.projectItemDescription}>
                            {project.description}
                          </div>
                        )}
                      </div>
                    ))}
                    {userProjects.length > 3 && (
                      <div className={style.projectsMore}>
                        И еще {userProjects.length - 3} проектов
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className={style.modalActions}>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isLoading}
                  className={style.cancelButton}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={!tittle.trim() || isLoading}
                  className={style.submitButton}
                >
                  {isLoading ? (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Создание...
                    </>
                  ) : (
                    "Создать проект"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default LeftPanel;
