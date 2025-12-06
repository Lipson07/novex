import React, { useState, useEffect } from "react";
import style from "../../style/Main/LeftPanel.module.scss";
import { leftPanelIcons } from "../../assets/LeftPanel/index.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user.js";
import { ProjectService, formatDate } from "../../assets/MockData/index.js";

interface Project {
  id: number;
  tittle: string;
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
  currentPage?: "main" | "projects" | "project-detail";
  onProjectClick?: (projectId: number) => void;
  activeProjectId?: number | null;
}

function LeftPanel({
  onPageChange,
  currentPage,
  onProjectClick,
  activeProjectId,
}: LeftPanelProps) {
  const user = useSelector(selectUser);
  const [activeCategory, setActiveCategory] = useState(0);
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

  useEffect(() => {
    if (activeProjectId && currentPage === "project-detail") {
      setIsProjectsListCollapsed(false);
    }
  }, [activeProjectId, currentPage]);

  useEffect(() => {
    if (currentPage === "projects") {
      const projectsIndex = leftPanelIcons.findIndex(
        (icon) => icon.name === "Проекты"
      );
      if (projectsIndex !== -1) {
        setActiveCategory(projectsIndex);
      }
    } else if (currentPage === "main") {
      const mainIndex = leftPanelIcons.findIndex(
        (icon) => icon.name === "Главная"
      );
      if (mainIndex !== -1) {
        setActiveCategory(mainIndex);
      }
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
  }, []);

  const fetchUserProjects = async () => {
    try {
      setProjectsLoading(true);
      const projects = await ProjectService.getAllProjects();
      setUserProjects(projects);
    } catch (error) {
      console.error("Ошибка загрузки проектов:", error);
      setUserProjects([]);
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
      fetchUserProjects();
      closeModal();
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
      if (categoryName === "Проекты") {
        onPageChange("projects");
      } else if (categoryName === "Главная") {
        onPageChange("main");
      } else {
        onPageChange("main");
      }
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

  return (
    <>
      <div className={style.main}>
        <div className={style.header}>
          <div className={style.naming}>
            <div className={style.svgbox}>
              <svg
                width="20"
                height="22"
                viewBox="0 0 20 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.00341 13.0026C1.81418 13.0032 1.62864 12.9502 1.46836 12.8496C1.30809 12.749 1.17964 12.605 1.09796 12.4343C1.01628 12.2636 0.984703 12.0732 1.00691 11.8853C1.02912 11.6973 1.10419 11.5196 1.22341 11.3726L11.1234 1.1726C11.1977 1.08689 11.2989 1.02896 11.4104 1.00834C11.5219 0.987714 11.6371 1.00562 11.7371 1.05911C11.8371 1.1126 11.916 1.1985 11.9607 1.30271C12.0055 1.40692 12.0135 1.52325 11.9834 1.6326L10.0634 7.6526C10.0068 7.80413 11.9844 8.96444 12.0046 9.12493C12.0248 9.28541 12.0837 9.4386 12.1761 9.57135C12.2685 9.70409 12.3918 9.81243 12.5353 9.88708C12.6788 9.96172 12.8382 10.0004 13 9.99992H20C20.1892 9.99927 20.3748 10.0523 20.535 10.1529C20.6953 10.2535 20.8238 10.3976 20.9054 10.5683C20.9871 10.739 21.0187 10.9293 20.9965 11.1173C20.9743 11.3052 20.8992 11.483 20.78 11.6299L10.88 21.8299C10.8057 21.9156 10.7045 21.9736 10.593 21.9942C10.4815 22.0148 10.3663 21.9969 10.2663 21.9434C10.1663 21.8899 10.0874 21.804 10.0427 21.6998C9.99791 21.5956 9.98991 21.4793 10.02 21.3699L11.94 15.3499C11.9966 15.1984 12.0156 15.0354 11.9954 14.8749C11.9752 14.7144 11.9163 14.5612 11.8239 14.4285C11.7315 14.2957 11.6082 14.1874 11.4647 14.1128C11.3212 14.0381 11.1617 13.9994 11 13.9999H2.00341Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={style.namingtxt}>
              <p>Рабочее пространство</p>
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
                                    {project.tittle}
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
                            {project.tittle}
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
