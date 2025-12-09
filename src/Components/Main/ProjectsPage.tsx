import React, { useState, useEffect, useMemo } from "react";
import style from "../../style/Main/ProjectsPage.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user.js";
import {
  ProjectService,
  formatDate,
  getStatusColor,
  getStatusText,
} from "../../assets/MockData/index.js";

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

// Доступные статусы для фильтрации
const STATUS_FILTERS = [
  { id: "all", label: "Все" },
  { id: "active", label: "Активные" },
  { id: "completed", label: "Завершенные" },
  { id: "pending", label: "В ожидании" },
  { id: "archived", label: "Архивные" },
];

interface ProjectsPageProps {
  onProjectClick?: (projectId: number) => void;
}

function ProjectsPage({ onProjectClick }: ProjectsPageProps) {
  const user = useSelector(selectUser);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (user?.id) {
      fetchProjects();
    }
  }, [user?.id]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError("");
      if (!user?.id) {
        setError("Пользователь не авторизован");
        return;
      }
      const projectsData = await ProjectService.getAllProjects(user.id);
      setProjects(projectsData);
    } catch (error) {
      console.error("Ошибка загрузки проектов:", error);
      setError("Не удалось загрузить проекты");
    } finally {
      setIsLoading(false);
    }
  };

  // Фильтрация проектов
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Фильтрация по поиску
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.tittle.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          project.status?.toLowerCase().includes(query)
      );
    }

    // Фильтрация по статусу
    if (activeFilter !== "all") {
      filtered = filtered.filter(
        (project) => project.status?.toLowerCase() === activeFilter
      );
    }

    return filtered;
  }, [projects, searchQuery, activeFilter]);

  const handleProjectClick = (projectId: number) => {
    if (onProjectClick) {
      onProjectClick(projectId);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
  };

  const getStatusBadgeText = (status?: string) => {
    if (!status) return "Без статуса";
    return getStatusText(status) || status;
  };

  const getStatusBadgeColor = (status?: string) => {
    if (!status) return "#666"; // Fallback цвет
    return getStatusColor(status);
  };

  return (
    <div className={style.projectsPage}>
      <div className={style.content}>
        {isLoading ? (
          <div className={style.loading}>
            <div className={style.spinner}></div>
            <p>Загрузка проектов...</p>
          </div>
        ) : error ? (
          <div className={style.error}>
            <p>{error}</p>
            <button onClick={fetchProjects} className={style.retryBtn}>
              Попробовать снова
            </button>
          </div>
        ) : (
          <>
            {/* Поиск и фильтры */}
            <div className={style.searchFilters}>
              <div className={style.searchContainer}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 19L14.65 14.65"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Поиск проектов..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={style.searchInput}
                />
              </div>

              <div className={style.filters}>
                <div className={style.filterLabel}>Статус:</div>
                <div className={style.filterButtons}>
                  {STATUS_FILTERS.map((filter) => (
                    <button
                      key={filter.id}
                      className={`${style.filterBtn} ${
                        activeFilter === filter.id ? style.active : ""
                      }`}
                      onClick={() => handleFilterClick(filter.id)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Заголовок */}
            <div className={style.projectsHeader}>
              <h1 className={style.title}>Проекты</h1>
              <p className={style.subtitle}>
                {searchQuery || activeFilter !== "all"
                  ? `Найдено проектов: ${filteredProjects.length}`
                  : `Все ваши проекты: ${projects.length}`}
              </p>
            </div>

            {/* Сетка проектов */}
            {filteredProjects.length === 0 ? (
              <div className={style.empty}>
                <div className={style.emptyIcon}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>
                  {searchQuery || activeFilter !== "all"
                    ? "Проекты не найдены"
                    : "Нет проектов"}
                </h3>
                <p>
                  {searchQuery
                    ? "Попробуйте изменить поисковый запрос"
                    : activeFilter !== "all"
                    ? "Измените фильтр статуса"
                    : "Создайте свой первый проект, чтобы начать работу"}
                </p>
              </div>
            ) : (
              <div className={style.projectsGrid}>
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={style.projectCard}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <div className={style.cardHeader}>
                      <div className={style.projectInfo}>
                        <h3 className={style.projectTitle}>{project.tittle}</h3>
                        <span
                          className={style.statusBadge}
                          style={{
                            backgroundColor: `${getStatusColor(
                              project.status
                            )}20`,
                            color: getStatusColor(project.status),
                          }}
                        >
                          {getStatusText(project.status)}
                        </span>
                      </div>
                      <div className={style.projectStats}>
                        {project.members !== undefined && (
                          <div className={style.stat}>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle
                                cx="9"
                                cy="7"
                                r="4"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <path
                                d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                            <span>{project.members}</span>
                          </div>
                        )}
                        {project.tasks !== undefined && (
                          <div className={style.stat}>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M22 11.08V12a10 10 0 11-5.93-9.14"
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
                            <span>{project.tasks}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={style.projectDescription}>
                      <p>{project.description || "Описание отсутствует"}</p>
                    </div>

                    {project.progress !== undefined && (
                      <div className={style.progressSection}>
                        <div className={style.progressHeader}>
                          <span>Прогресс</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className={style.progressBar}>
                          <div
                            className={style.progressFill}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className={style.cardFooter}>
                      <div className={style.dateInfo}>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
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
                        <span>Создан {formatDate(project.created_at)}</span>
                      </div>
                      <button
                        className={style.projectAction}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProjectClick(project.id);
                        }}
                      >
                        Открыть →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectsPage;
