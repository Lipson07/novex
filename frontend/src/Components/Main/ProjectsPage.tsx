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
import ProjectCreationModal from "../Common/ProjectCreationModal.tsx";
import DeleteConfirmationModal from "../Common/DeleteConfirmationModal.tsx";

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
  priority?: string;
  tags?: string[];
  deadline?: string;
  owner_name?: string;
}

// Доступные статусы для фильтрации
const STATUS_FILTERS = [
  { id: "all", label: "Все" },
  { id: "active", label: "Активные" },
  { id: "completed", label: "Завершенные" },
  { id: "pending", label: "В ожидании" },
  { id: "archived", label: "Архивные" },
];

// Приоритеты проектов
const PRIORITY_COLORS: Record<string, string> = {
  high: "#FF6467",
  medium: "#FDC700",
  low: "#667EEA",
};

const PRIORITY_LABELS: Record<string, string> = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

interface ProjectsPageProps {
  onProjectClick?: (projectId: number) => void;
  projectRefreshKey?: number;
}

function ProjectsPage({
  onProjectClick,
  projectRefreshKey = 0,
}: ProjectsPageProps) {
  const user = useSelector(selectUser);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    projectId: null as number | null,
    projectTitle: "",
  });

  useEffect(() => {
    if (user?.id) {
      fetchProjects();
    }
  }, [user?.id, projectRefreshKey]);

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
          project.title.toLowerCase().includes(query) ||
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

  const handleEditProject = (projectId: number) => {
    console.log("Редактирование проекта", projectId);
    // TODO: открыть модальное окно редактирования или перейти на страницу редактирования
    alert(`Редактирование проекта ${projectId} (заглушка)`);
  };

  const openDeleteModal = (projectId: number, projectTitle: string) => {
    setDeleteModal({
      isOpen: true,
      projectId,
      projectTitle,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      projectId: null,
      projectTitle: "",
    });
  };

  const handleDeleteProject = async (projectId: number) => {
    console.log("handleDeleteProject вызван для проекта", projectId);

    // Находим проект для получения названия
    const project = projects.find(p => p.id === projectId);
    if (project) {
      openDeleteModal(projectId, project.title);
    }
  };

  const confirmDeleteProject = async () => {
    const { projectId } = deleteModal;
    if (!projectId) return;

    try {
      console.log("Удаление проекта", projectId);
      if (!user?.id) {
        alert("Ошибка: пользователь не авторизован");
        return;
      }
      // Используем новый метод deleteProject
      const result = await ProjectService.deleteProject(projectId, user.id);
      console.log("Результат удаления:", result);
      if (result.success) {
        // Обновить список проектов
        fetchProjects();
      } else {
        alert(
          `Ошибка удаления проекта: ${result.message || "Неизвестная ошибка"}`
        );
      }
    } catch (error) {
      console.error("Ошибка удаления проекта:", error);
      alert(
        `Не удалось удалить проект: ${
          error instanceof Error ? error.message : "Неизвестная ошибка"
        }`
      );
    } finally {
      closeDeleteModal();
    }
  };

  const handleViewMembers = (projectId: number) => {
    alert(`Просмотр участников проекта ${projectId} (заглушка)`);
  };

  const handleViewTasks = (projectId: number) => {
    alert(`Просмотр задач проекта ${projectId} (заглушка)`);
  };

  const handleToggleView = () => {
    alert("Переключение вида (сетка/список) - в разработке");
  };

  const handleCreateNewProject = () => {
    console.log("handleCreateNewProject вызван");
    setIsCreateModalOpen(true);
  };

  const handleCreateProjectSubmit = async (projectData: { title: string; description: string }) => {
    if (!user?.id) {
      throw new Error("Ошибка: пользователь не авторизован");
    }

    setIsCreating(true);
    try {
      const payload = {
        tittle: projectData.title.trim(), // API ожидает поле "tittle" (с двумя t)
        description: projectData.description.trim(),
        owner_id: user.id,
      };
      console.log("Отправка данных проекта:", payload);
      const newProject = await ProjectService.createProject(payload);
      console.log("Проект создан:", newProject);
      // Обновить список проектов
      fetchProjects();
    } catch (error) {
      console.error("Ошибка создания проекта:", error);
      throw new Error("Ошибка создания проекта");
    } finally {
      setIsCreating(false);
    }
  };


  const getStatusBadgeText = (status?: string) => {
    if (!status) return "Без статуса";
    return getStatusText(status) || status;
  };

  const getStatusBadgeColor = (status?: string) => {
    if (!status) return "#666"; // Fallback цвет
    return getStatusColor(status);
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    const color = PRIORITY_COLORS[priority] || "#667EEA";
    const label = PRIORITY_LABELS[priority] || priority;
    return { color, label };
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    const today = new Date();
    const diffDays = Math.ceil(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return { text: "Просрочено", color: "#FF6467" };
    if (diffDays === 0) return { text: "Сегодня", color: "#FDC700" };
    if (diffDays === 1) return { text: "Завтра", color: "#FDC700" };
    if (diffDays <= 7)
      return { text: `Через ${diffDays} дн.`, color: "#667EEA" };
    return {
      text: date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
      }),
      color: "#888",
    };
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

            {/* Заголовок и статистика */}
            <div className={style.projectsHeader}>
              <div className={style.headerTop}>
                <h1 className={style.title}>Проекты</h1>
                <div className={style.headerActions}>
                  <button
                    className={style.newProjectBtn}
                    onClick={handleCreateNewProject}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Новый проект
                  </button>
                  <button
                    className={style.viewToggle}
                    onClick={handleToggleView}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className={style.headerStats}>
                <div className={style.statCard}>
                  <span className={style.statLabel}>Всего проектов</span>
                  <span className={style.statValue}>{projects.length}</span>
                </div>
                <div className={style.statCard}>
                  <span className={style.statLabel}>Активные</span>
                  <span className={style.statValue}>
                    {projects.filter((p) => p.status === "active").length}
                  </span>
                </div>
                <div className={style.statCard}>
                  <span className={style.statLabel}>Завершено</span>
                  <span className={style.statValue}>
                    {projects.filter((p) => p.status === "completed").length}
                  </span>
                </div>
                <div className={style.statCard}>
                  <span className={style.statLabel}>Прогресс</span>
                  <span className={style.statValue}>
                    {projects.length > 0
                      ? `${Math.round(
                          projects.reduce(
                            (acc, p) => acc + (p.progress || 0),
                            0
                          ) / projects.length
                        )}%`
                      : "0%"}
                  </span>
                </div>
              </div>
              <p className={style.subtitle}>
                {searchQuery || activeFilter !== "all"
                  ? `Найдено проектов: ${filteredProjects.length}`
                  : `Управляйте всеми вашими проектами в одном месте`}
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
                        <div className={style.titleRow}>
                          <h3 className={style.projectTitle}>
                            {project.title}
                          </h3>
                          <div className={style.badgeContainer}>
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
                            {project.priority && (
                              <span
                                className={style.priorityBadge}
                                style={{
                                  backgroundColor: `${
                                    PRIORITY_COLORS[project.priority]
                                  }20`,
                                  color: PRIORITY_COLORS[project.priority],
                                }}
                              >
                                {PRIORITY_LABELS[project.priority] ||
                                  project.priority}
                              </span>
                            )}
                          </div>
                        </div>
                        {project.owner_name && (
                          <div className={style.ownerInfo}>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <circle
                                cx="12"
                                cy="7"
                                r="4"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                            <span>{project.owner_name}</span>
                          </div>
                        )}
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
                      {/* Кнопки редактирования и удаления проекта */}
                      <div className={style.projectActions}>
                        <button
                          className={style.projectActionButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProject(project.id);
                          }}
                          title="Редактировать проект"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className={style.projectActionButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                          title="Удалить проект"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className={style.projectDescription}>
                      <p>{project.description || "Описание отсутствует"}</p>
                    </div>

                    <div className={style.projectMetrics}>
                      <div className={style.metric}>
                        <span className={style.metricLabel}>Участники</span>
                        <span className={style.metricValue}>
                          {project.members !== undefined
                            ? project.members
                            : "0"}
                        </span>
                      </div>
                      <div className={style.metric}>
                        <span className={style.metricLabel}>Задачи</span>
                        <span className={style.metricValue}>
                          {project.tasks !== undefined ? project.tasks : "0"}
                        </span>
                      </div>
                      <div className={style.metric}>
                        <span className={style.metricLabel}>Обновлен</span>
                        <span className={style.metricValue}>
                          {formatDate(project.updated_at)}
                        </span>
                      </div>
                    </div>

                    {project.tags && project.tags.length > 0 && (
                      <div className={style.tagsContainer}>
                        {project.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className={style.tag}>
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className={style.moreTags}>
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className={style.bottomSection}>
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

                      <div className={style.actionButtons}>
                        <button
                          className={style.quickAction}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMembers(project.id);
                          }}
                        >
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
                            />
                            <circle
                              cx="9"
                              cy="7"
                              r="4"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                          Участники
                        </button>
                        <button
                          className={style.quickAction}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTasks(project.id);
                          }}
                        >
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
                            />
                            <path
                              d="M22 4L12 14.01l-3-3"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                          Задачи
                        </button>
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
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {/* Модальное окно создания проекта */}
        <ProjectCreationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateProjectSubmit}
          isCreating={isCreating}
        />

        {/* Модальное окно подтверждения удаления проекта */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteProject}
          type="project"
          itemName={deleteModal.projectTitle}
        />
      </div>
    </div>
  );
}

export default React.memo(ProjectsPage);
