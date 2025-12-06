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
  onPageChange?: (page: "main" | "projects") => void;
}

function LeftPanel({ onPageChange }: LeftPanelProps) {
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

  const suggestions = [
    "Обзор дорожной карты Q4",
    "Обновить документацию дизайн-системы",
    "Запланировать синхронизацию команды",
  ];

  // Получаем 3 последних проекта
  const recentProjects = userProjects
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 3);

  useEffect(() => {
    if (user.id) {
      fetchUserProjects();
    }
  }, [user.id]);

  const fetchUserProjects = async () => {
    try {
      setProjectsLoading(true);
      const projects = await ProjectService.getUserProjects(user.id);
      setUserProjects(projects);
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
    if (user.id) {
      fetchUserProjects();
    }
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
        owner_id: user.id,
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

    if (categoryName === "Проекты" && onPageChange) {
      onPageChange("projects");
    } else if (onPageChange && categoryName !== "Проекты") {
      onPageChange("main");
    }
  };

  const handleProjectClick = (projectId: number) => {
    console.log("Открыть проект:", projectId);
    if (onPageChange) {
      onPageChange("projects");
    }
  };

  const handleViewAllProjects = () => {
    if (onPageChange) {
      onPageChange("projects");
    }
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
                  d="M2.00341 13.0026C1.81418 13.0032 1.62864 12.9502 1.46836 12.8496C1.30809 12.749 1.17964 12.605 1.09796 12.4343C1.01628 12.2636 0.984703 12.0732 1.00691 11.8853C1.02912 11.6973 1.10419 11.5196 1.22341 11.3726L11.1234 1.1726C11.1977 1.08689 11.2989 1.02896 11.4104 1.00834C11.5219 0.987714 11.6371 1.00562 11.7371 1.05911C11.8371 1.1126 11.916 1.1985 11.9607 1.30271C12.0055 1.40692 12.0135 1.52325 11.9834 1.6326L10.0634 7.6526C10.0068 7.80413 9.98778 7.96712 10.008 8.12761C10.0282 8.2881 10.0871 8.44129 10.1795 8.57403C10.2719 8.70678 10.3952 8.81512 10.5387 8.88976C10.6822 8.96441 10.8417 9.00313 11.0034 9.0026H18.0034C18.1926 9.00196 18.3782 9.05502 18.5385 9.15563C18.6987 9.25623 18.8272 9.40025 18.9089 9.57095C18.9905 9.74165 19.0221 9.93202 18.9999 10.1199C18.9777 10.3079 18.9026 10.4856 18.7834 10.6326L8.88341 20.8326C8.80915 20.9183 8.70795 20.9762 8.59643 20.9969C8.48491 21.0175 8.36969 20.9996 8.26968 20.9461C8.16967 20.8926 8.09083 20.8067 8.04607 20.7025C8.00132 20.5983 7.99333 20.482 8.02341 20.3726L9.94341 14.3526C10 14.2011 10.019 14.0381 9.99882 13.8776C9.9786 13.7171 9.91975 13.5639 9.82732 13.4312C9.73489 13.2984 9.61164 13.1901 9.46813 13.1154C9.32463 13.0408 9.16516 13.0021 9.00341 13.0026H2.00341Z"
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

                  {/* Список последних проектов */}
                  <div className={style.projectsListSection}>
                    <div className={style.projectsListTitle}>
                      Последние проекты
                    </div>

                    {projectsLoading ? (
                      <div className={style.projectsLoading}>
                        Загрузка проектов...
                      </div>
                    ) : recentProjects.length === 0 ? (
                      <div className={style.projectsEmpty}>Нет проектов</div>
                    ) : (
                      <>
                        {recentProjects.map((project) => (
                          <div
                            key={project.id}
                            className={style.projectListItem}
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

                        <div
                          className={style.viewAllProjectsLink}
                          onClick={handleViewAllProjects}
                        >
                          <span>Все проекты</span>
                          <svg
                            width="14"
                            height="14"
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
                        </div>
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
          <div className={style.glassCard}>
            <div className={style.cardHeader}>
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
                  <div className={style.aiName}>Synapse AI</div>
                  <div className={style.aiStatus}>
                    <div className={style.statusDot}></div>
                    <span>Всегда учится</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={style.cardContent}>
              <div className={style.suggestionsTitle}>Умные предложения</div>

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
                    <span className={style.suggestionText}>{suggestion}</span>
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
