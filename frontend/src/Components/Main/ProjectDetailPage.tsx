import React, { useState, useEffect, useRef } from "react";
import noteIcon from "../../assets/icons/variant=1.svg";
import taskIcon from "../../assets/icons/variant=11.svg";
import chatIcon from "../../assets/icons/variant=16.svg";
import scheduleIcon from "../../assets/icons/variant=17.svg";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user.js";
import {
  ProjectService,
  formatDate,
  getStatusColor,
  getStatusText,
  getPriorityColor,
  formatDeadlineDate,
} from "../../assets/MockData/index.js";
import Dashboard from "./Dashboard";
import style from "../../style/Main/ProjectDetailPage.module.scss";
import GitHubRepos from "./GitHubRepos.js";

interface Project {
  id: number;
  title: string;
  description: string;
  owner_id: number;
  owner_name?: string;
  created_at: string;
  updated_at: string;
  deadline?: string;
  progress?: number;
  members?: number;
  tasks?: number;
  status?: string;
  priority?: "low" | "medium" | "high";
  tags?: string[];
  budget?: number;
}

interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
  assigned_to: number | null;
  tags: string[];
  files: File[];
}

interface ProjectDetailPageProps {
  projectId: number;
  onBack?: () => void;
  onNavigateToTeamChat?: (projectId: number) => void;
  onNavigateToSchedule?: (projectId: number) => void;
  onNavigateToQuickNote?: (projectId: number) => void;
  onNavigateToAI?: () => void;
  onProjectDeleted?: () => void;
}

function ProjectDetailPage({
  projectId,
  onBack,
  onNavigateToTeamChat,
  onNavigateToSchedule,
  onNavigateToQuickNote,
  onNavigateToAI,
  onProjectDeleted,
}: ProjectDetailPageProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskData, setTaskData] = useState<TaskFormData>({
    title: "",
    description: "",
    due_date: "",
    status: "pending",
    priority: "medium",
    assigned_to: null,
    tags: [],
    files: [],
  });

  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [isAIDropdownOpen, setIsAIDropdownOpen] = useState(false);
  const aiDropdownRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "tasks">("overview");
  const [chatMessage, setChatMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [availableUsers, setAvailableUsers] = useState<
    { id: number; name: string }[]
  >([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [taskRefreshKey, setTaskRefreshKey] = useState(0);

  const aiSuggestions = [
    "Обзор дорожной карты Q4",
    "Обновить документацию дизайн-системы",
    "Запланировать синхронизацию команды",
  ];

  const quickAccessData = [
    {
      id: 1,
      title: "Создать отчет",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`,
      action: "createReport",
    },
    {
      id: 2,
      title: "Планирование",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>`,
      action: "planning",
    },
    {
      id: 3,
      title: "Аналитика",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`,
      action: "analytics",
    },
    {
      id: 4,
      title: "Документы",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H16L20 7V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3V7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 14H15M9 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>`,
      action: "documents",
    },
  ];

  const renderQuickAccess = (item: (typeof quickAccessData)[number]) => (
    <button
      key={item.id}
      className={style.quickAccessItem}
      onClick={() => console.log(`Быстрый доступ: ${item.action}`)}
    >
      <div
        className={style.quickAccessIcon}
        dangerouslySetInnerHTML={{ __html: item.icon }}
      />
      <span className={style.quickAccessTitle}>{item.title}</span>
    </button>
  );

  // Закрытие AI dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        aiDropdownRef.current &&
        !aiDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAIDropdownOpen(false);
      }
    };

    if (isAIDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAIDropdownOpen]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      console.log("Отправка сообщения ИИ:", chatMessage);
      setChatMessage("");
    }
  };

  const handleAddFiles = (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) return;

    setTaskData((prev) => ({
      ...prev,
      files: [...prev.files, ...imageFiles],
    }));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    if (event.dataTransfer?.files) {
      handleAddFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleAddFiles(event.target.files);
      event.target.value = "";
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setTaskData((prev) => ({
      ...prev,
      files: prev.files.filter((file) => file.name !== fileName),
    }));
  };

  const handleTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(
      "Создание задачи для проекта",
      projectId,
      "с данными:",
      taskData,
    );
    try {
      // Подготовка данных для отправки
      const taskPayload = {
        ...taskData,
        project_id: projectId,
        created_by: user?.id,
        // tags уже массив
        tags: taskData.tags,
        // due_date должен быть в формате YYYY-MM-DD или null
        due_date: taskData.due_date || null,
      };
      // Вызов API
      const createdTask = await ProjectService.createTask(taskPayload);
      console.log("Задача успешно создана:", createdTask);
      // Сброс формы
      setTaskData({
        title: "",
        description: "",
        due_date: "",
        status: "pending",
        priority: "medium",
        assigned_to: null,
        tags: [],
        files: [],
      });
      setIsTaskModalOpen(false);
      // Увеличиваем ключ обновления для перезагрузки Dashboard
      setTaskRefreshKey((prev) => prev + 1);
      // Можно показать уведомление или обновить список задач
      // Например, перезагрузить Dashboard
    } catch (error) {
      console.error("Ошибка создания задачи:", error);
      // Здесь можно показать ошибку пользователю
      alert(
        `Ошибка создания задачи: ${
          error instanceof Error ? error.message : "Неизвестная ошибка"
        }`,
      );
    }
  };
  const user = useSelector(selectUser);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProject();
    loadGithubRepos();
    loadProjectMembers();
    loadActivityLogs();
  }, [projectId]);

  // Загрузка пользователей для назначения задач
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const users = await ProjectService.getUsers();
        setAvailableUsers(
          users.map((user: any) => ({ id: user.id, name: user.name })),
        );
      } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
        // Можно оставить пустой массив или показать уведомление
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, []);

  // Загрузка GitHub репозиториев проекта
  const loadGithubRepos = async () => {
    try {
      setLoadingRepos(true);
      const repos = await ProjectService.getProjectRepos(projectId);
      setGithubRepos(repos);
    } catch (error) {
      console.error("Ошибка загрузки репозиториев:", error);
      setGithubRepos([]);
    } finally {
      setLoadingRepos(false);
    }
  };

  // Загрузка участников проекта
  const loadProjectMembers = async () => {
    try {
      const members = await ProjectService.getProjectMembers(projectId);
      // Преобразуем данные из API в ожидаемый формат
      const formattedMembers = members.map((member: any) => ({
        id: member.id,
        name: member.name,
        role: member.role || "member",
        status: "online", // TODO: получить реальный статус из API
      }));
      setProjectMembers(formattedMembers);
    } catch (error) {
      console.error("Ошибка загрузки участников:", error);
      setProjectMembers([]);
    }
  };

  // Загрузка логов активности
  const loadActivityLogs = async () => {
    try {
      const logs = await ProjectService.getActivityLogs(projectId);
      setActivityLogs(logs);
    } catch (error) {
      console.error("Ошибка загрузки логов:", error);
      setActivityLogs([]);
    }
  };

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      setError("");
      const projectData = await ProjectService.getProjectById(
        projectId,
        user?.id,
      );
      setProject(projectData);
    } catch (error) {
      console.error("Ошибка загрузки проекта:", error);
      setError("Не удалось загрузить проект");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = () => {
    setIsTaskModalOpen(true);
  };

  const handleAIPage = () => {
    onNavigateToAI?.();
  };

  const handleTeamChat = () => {
    onNavigateToTeamChat?.(projectId);
  };

  const handleSchedule = () => {
    onNavigateToSchedule?.(projectId);
  };

  const handleQuickNote = () => {
    onNavigateToQuickNote?.(projectId);
  };

  const handleEditProject = (projectId: number) => {
    console.log("Редактирование проекта", projectId);
    // TODO: открыть модальное окно редактирования или перейти на страницу редактирования
    alert(`Редактирование проекта ${projectId} (заглушка)`);
  };

  const handleDeleteProject = async (projectId: number) => {
    console.log(
      "handleDeleteProject вызван в ProjectDetailPage для проекта",
      projectId,
    );

    // Временное решение для отладки: всегда удаляем без подтверждения
    // TODO: вернуть confirm после отладки
    const shouldDelete = true; // confirm("Вы уверены, что хотите удалить проект? Это действие нельзя отменить.");

    if (!shouldDelete) {
      console.log("Удаление отменено пользователем");
      return;
    }

    try {
      console.log("Удаление проекта", projectId);
      if (!user?.id) {
        alert("Ошибка: пользователь не авторизован");
        return;
      }
      const result = await ProjectService.deleteProject(projectId, user.id);
      console.log("Результат удаления:", result);
      if (result.success) {
        alert(`Проект ${projectId} успешно удален`);
        // Вызываем callback для обновления данных в других компонентах
        if (onProjectDeleted) {
          onProjectDeleted();
        }
        // После удаления можно вернуться к списку проектов
        if (onBack) {
          onBack();
        }
      } else {
        alert(
          `Ошибка удаления проекта: ${result.message || "Неизвестная ошибка"}`,
        );
      }
    } catch (error) {
      console.error("Ошибка удаления проекта:", error);
      alert(
        `Не удалось удалить проект: ${
          error instanceof Error ? error.message : "Неизвестная ошибка"
        }`,
      );
    }
  };

  const handleAddGithubRepo = () => {
    // TODO: открыть модальное окно для добавления репозитория
    alert("Функция добавления GitHub репозитория в разработке");
  };

  if (isLoading) {
    return (
      <div className={style.projectDetailPage}>
        <div className={style.loading}>
          <div className={style.spinner}></div>
          <p>Загрузка проекта...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={style.projectDetailPage}>
        <div className={style.error}>
          <p>{error || "Проект не найден"}</p>
          {onBack && (
            <button onClick={onBack} className={style.backButton}>
              Вернуться к проектам
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={style.projectDetailPage}>
      <div className={style.content}>
        {/* Улучшенный header */}
        <div className={style.projectHeader}>
          <div className={style.headerTop}>
            <div className={style.headerLeft}>
              {onBack && (
                <button onClick={onBack} className={style.backButton}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div className={style.titleGroup}>
                <h1 className={style.projectTitle}>{project.title}</h1>
                <span
                  className={style.statusBadge}
                  style={{
                    backgroundColor: `${getStatusColor(project.status)}20`,
                    color: getStatusColor(project.status),
                  }}
                >
                  {getStatusText(project.status)}
                </span>
              </div>
            </div>

            <div className={style.headerRight}>
              <div className={style.projectMeta}>
                <div className={style.metaItem} title="Дата создания проекта">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3.33329 16.6667H16.6666C17.1087 16.6667 17.5326 16.4911 17.8451 16.1785C18.1577 15.866 18.3333 15.442 18.3333 15V6.66667C18.3333 6.22464 18.1577 5.80072 17.8451 5.48816C17.5326 5.17559 17.1087 5 16.6666 5H10.0583C9.78378 4.99858 9.51387 4.92937 9.27254 4.79853C9.03121 4.66769 8.82594 4.47927 8.67496 4.25L7.99163 3.25C7.84065 3.02073 7.63537 2.83231 7.39404 2.70147C7.15272 2.57063 6.8828 2.50142 6.60829 2.5H3.33329C2.89127 2.5 2.46734 2.67559 2.15478 2.98816C1.84222 3.30072 1.66663 3.72464 1.66663 4.16667V15C1.66663 15.9167 2.41663 16.6667 3.33329 16.6667Z" />
                    <path d="M6.66663 8.33325V11.6666" />
                    <path d="M10 8.33325V9.99992" />
                    <path d="M13.3334 8.33325V13.3333" />
                  </svg>
                  <span>Создан {formatDate(project.created_at)}</span>
                </div>
                {project.updated_at && (
                  <div
                    className={style.metaItem}
                    title="Дата последнего обновления проекта"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Обновлен {formatDate(project.updated_at)}</span>
                  </div>
                )}
                {project.deadline && (
                  <div
                    className={style.metaItem}
                    title="Крайний срок выполнения проекта"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Дедлайн: {formatDeadlineDate(project.deadline)}</span>
                  </div>
                )}
                {project.owner_name && (
                  <div className={style.metaItem} title="Владелец проекта">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Владелец: {project.owner_name}</span>
                  </div>
                )}
                {project.priority && (
                  <div
                    className={style.metaItem}
                    title="Приоритет проекта (высокий, средний, низкий)"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span style={{ color: getPriorityColor(project.priority) }}>
                      Приоритет:{" "}
                      {project.priority === "high"
                        ? "Высокий"
                        : project.priority === "medium"
                          ? "Средний"
                          : "Низкий"}
                    </span>
                  </div>
                )}
              </div>

              <div className={style.actionButtons}>
                <button
                  className={style.actionButton}
                  onClick={handleCreateTask}
                  data-action="add-task"
                  title="Добавить задачу"
                >
                  <p>Добавить задачу</p>
                  <img
                    src={taskIcon}
                    alt="Добавить задачу"
                    width="20"
                    height="20"
                  />
                </button>
                <button
                  className={style.actionButton}
                  onClick={handleAIPage}
                  data-action="ai"
                  title="ИИ-ассистент: получить рекомендации и аналитику"
                >
                  <p>ИИ-ассистент</p>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </button>
                <button
                  className={style.actionButton}
                  onClick={handleTeamChat}
                  data-action="team-chat"
                  title="Командный чат: обсуждение проекта с участниками"
                >
                  <p>Командный чат</p>
                  <img
                    src={chatIcon}
                    alt="Командный чат"
                    width="20"
                    height="20"
                  />
                </button>
                <button
                  className={style.actionButton}
                  onClick={handleSchedule}
                  data-action="schedule"
                  title="Расписание: управление сроками и событиями"
                >
                  <p>Расписание</p>
                  <img
                    src={scheduleIcon}
                    alt="Расписание"
                    width="20"
                    height="20"
                  />
                </button>
                <button
                  className={style.actionButton}
                  onClick={handleQuickNote}
                  data-action="quick-note"
                  title="Быстрая заметка: записать идеи или напоминания"
                >
                  <p>Быстрая заметка</p>
                  <img
                    src={noteIcon}
                    alt="Быстрая заметка"
                    width="20"
                    height="20"
                  />
                </button>
                {/* Кнопки редактирования и удаления проекта */}
                <button
                  className={style.actionButton}
                  onClick={() => handleEditProject(project.id)}
                  data-action="edit-project"
                  title="Редактировать проект"
                >
                  <p>Редактировать проект</p>
                  <svg
                    width="20"
                    height="20"
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
                  className={style.actionButton}
                  onClick={() => handleDeleteProject(project.id)}
                  data-action="delete-project"
                  title="Удалить проект"
                >
                  <p>Удалить проект</p>
                  <svg
                    width="20"
                    height="20"
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
          </div>

          {project.description && (
            <div className={style.projectDescription}>
              <p>{project.description}</p>
            </div>
          )}

          {/* Теги и дополнительные метки */}
          {project.tags && project.tags.length > 0 && (
            <div className={style.tagsContainer}>
              {project.tags.map((tag, index) => (
                <span key={index} className={style.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Статистика проекта */}
          <div className={style.projectStats}>
            {project.progress !== undefined && (
              <div
                className={style.statCard}
                title="Общий прогресс выполнения проекта в процентах"
              >
                <div className={style.statIcon}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M13.3334 5.83325H18.3334V10.8333" />
                    <path d="M18.3333 5.83325L11.25 12.9166L7.08329 8.74992L1.66663 14.1666" />
                  </svg>
                </div>
                <div className={style.statContent}>
                  <div className={style.statValue}>{project.progress}%</div>
                  <div className={style.statLabel}>Прогресс</div>
                </div>
              </div>
            )}
            {project.tasks !== undefined && (
              <div
                className={style.statCard}
                title="Количество задач в проекте"
              >
                <div className={style.statIcon}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.16663 10H15.8333" />
                    <path d="M10 4.16675V15.8334" />
                  </svg>
                </div>
                <div className={style.statContent}>
                  <div className={style.statValue}>{project.tasks}</div>
                  <div className={style.statLabel}>Задач</div>
                </div>
              </div>
            )}
            {project.members !== undefined && (
              <div
                className={style.statCard}
                title="Количество участников проекта"
              >
                <div className={style.statIcon}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15.8333 17.5V15.8333C15.8333 14.9493 15.4821 14.1014 14.857 13.4763C14.2319 12.8512 13.384 12.5 12.5 12.5H7.49996C6.6159 12.5 5.76806 12.8512 5.14294 13.4763C4.51782 14.1014 4.16663 14.9493 4.16663 15.8333V17.5" />
                    <path d="M9.99996 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 9.99996 2.5C8.15901 2.5 6.66663 3.99238 6.66663 5.83333C6.66663 7.67428 8.15901 9.16667 9.99996 9.16667Z" />
                  </svg>
                </div>
                <div className={style.statContent}>
                  <div className={style.statValue}>{project.members}</div>
                  <div className={style.statLabel}>Участников</div>
                </div>
              </div>
            )}
            {project.budget !== undefined && (
              <div className={style.statCard} title="Бюджет проекта в рублях">
                <div className={style.statIcon}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 5.83325V14.1666" />
                    <path d="M13.3333 8.33325H8.33329C7.41282 8.33325 6.66663 9.07944 6.66663 9.99992C6.66663 10.9204 7.41282 11.6666 8.33329 11.6666H11.6666C12.5871 11.6666 13.3333 12.4128 13.3333 13.3333C13.3333 14.2537 12.5871 14.9999 11.6666 14.9999H6.66663" />
                    <path d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" />
                  </svg>
                </div>
                <div className={style.statContent}>
                  <div className={style.statValue}>
                    {project.budget.toLocaleString()} ₽
                  </div>
                  <div className={style.statLabel}>Бюджет</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Модальное окно создания задачи */}
        {isTaskModalOpen && (
          <div
            className={style.modalOverlay}
            onClick={() => setIsTaskModalOpen(false)}
          >
            <div
              className={style.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={style.modalTitle}>Создать новую задачу</h2>

              <form onSubmit={handleTaskSubmit} className={style.modalForm}>
                <div className={style.formGroup}>
                  <label htmlFor="task-title">Название задачи</label>
                  <input
                    id="task-title"
                    type="text"
                    value={taskData.title}
                    onChange={(e) =>
                      setTaskData({ ...taskData, title: e.target.value })
                    }
                    placeholder="Введите название задачи"
                    required
                  />
                </div>

                <div className={style.formGroup}>
                  <label htmlFor="task-description">Описание задачи</label>
                  <textarea
                    id="task-description"
                    value={taskData.description}
                    onChange={(e) =>
                      setTaskData({ ...taskData, description: e.target.value })
                    }
                    placeholder="Опишите задачу подробно..."
                    rows={4}
                  />
                </div>

                <div className={style.formGroup}>
                  <label>
                    Фото задачи
                    <span className={style.optionalLabel}> (png/jpg)</span>
                  </label>
                  <div
                    className={`${style.dropZone} ${
                      isDragOver ? style.dragOver : ""
                    }`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className={style.dropZoneContent}>
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={style.dropZoneIcon}
                      >
                        <path d="M12 5v14M5 12h14" />
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="4"
                          ry="4"
                        />
                      </svg>
                      <p>Перетащите фото сюда или нажмите, чтобы выбрать</p>
                      <span className={style.dropZoneHint}>
                        Поддерживаются изображения (PNG, JPG)
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className={style.fileInput}
                      onChange={handleFileChange}
                    />
                  </div>

                  {taskData.files.length > 0 && (
                    <div className={style.fileList}>
                      {taskData.files.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className={style.fileItem}
                        >
                          <div className={style.fileInfo}>
                            <div className={style.fileName}>{file.name}</div>
                            <div className={style.fileSize}>
                              {(file.size / 1024).toFixed(1)} КБ
                            </div>
                          </div>
                          <button
                            type="button"
                            className={style.removeFileButton}
                            onClick={() => handleRemoveFile(file.name)}
                            aria-label={`Удалить файл ${file.name}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={style.formGroup}>
                  <label htmlFor="task-due-date">Дата выполнения</label>
                  <input
                    id="task-due-date"
                    type="date"
                    value={taskData.due_date}
                    onChange={(e) =>
                      setTaskData({ ...taskData, due_date: e.target.value })
                    }
                    placeholder="YYYY-MM-DD"
                  />
                </div>

                <div className={style.formGroup}>
                  <label htmlFor="task-status">Статус</label>
                  <select
                    id="task-status"
                    value={taskData.status}
                    onChange={(e) =>
                      setTaskData({ ...taskData, status: e.target.value })
                    }
                  >
                    <option value="pending">Ожидание</option>
                    <option value="in_progress">В работе</option>
                    <option value="completed">Завершено</option>
                    <option value="cancelled">Отменено</option>
                  </select>
                </div>

                <div className={style.formGroup}>
                  <label htmlFor="task-priority">Приоритет</label>
                  <select
                    id="task-priority"
                    value={taskData.priority}
                    onChange={(e) =>
                      setTaskData({ ...taskData, priority: e.target.value })
                    }
                  >
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                    <option value="urgent">Срочный</option>
                  </select>
                </div>

                <div className={style.formGroup}>
                  <label htmlFor="task-assigned-to">Назначить на</label>
                  <select
                    id="task-assigned-to"
                    value={taskData.assigned_to || ""}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        assigned_to: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                  >
                    <option value="">Не назначено</option>
                    {availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={style.formGroup}>
                  <label htmlFor="task-tags">Теги (через запятую)</label>
                  <input
                    id="task-tags"
                    type="text"
                    value={taskData.tags.join(", ")}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((tag) => tag.length > 0),
                      })
                    }
                    placeholder="например, frontend, bug, urgent"
                  />
                </div>

                <div className={style.modalButtons}>
                  <button
                    type="button"
                    className={style.cancelButton}
                    onClick={() => setIsTaskModalOpen(false)}
                  >
                    Отмена
                  </button>
                  <button type="submit" className={style.submitButton}>
                    Создать задачу
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Разделы Обзор и Задачи */}
        <div className={style.sectionsContainer}>
          <div className={style.tabsContainer}>
            <button
              className={`${style.tab} ${
                activeTab === "overview" ? style.tabActive : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Обзор
            </button>
            <button
              className={`${style.tab} ${
                activeTab === "tasks" ? style.tabActive : ""
              }`}
              onClick={() => setActiveTab("tasks")}
            >
              Задачи
            </button>
          </div>

          {activeTab === "overview" && (
            <div className={style.overviewContent}>
              {/* GitHub репозитории */}
              <GitHubRepos projectId={projectId} />

              {/* Логи последних действий */}
              <div className={style.activityCard}>
                <div className={style.cardHeader}>
                  <div className={style.cardHeaderLeft}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                    <h3 className={style.cardTitle}>Логи последних действий</h3>
                  </div>
                </div>
                <div className={style.activityList}>
                  {activityLogs.length === 0 ? (
                    <div className={style.noActivity}>
                      <p>Нет записей о действиях</p>
                    </div>
                  ) : (
                    activityLogs.map((log) => (
                      <div key={log.id} className={style.activityItem}>
                        <div className={style.activityIcon}>
                          {log.action === "task_created" ? (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                          ) : log.action === "member_added" ? (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                          ) : (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                            </svg>
                          )}
                        </div>
                        <div className={style.activityContent}>
                          <p>{log.description}</p>
                          <span>{log.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Быстрый доступ — перенесен с главной */}
              <div className={style.quickAccessSection}>
                <div className={style.quickAccessHeader}>
                  <h3>Быстрый доступ</h3>
                  <span className={style.quickAccessHint}>
                    Шорткаты для текущего проекта
                  </span>
                </div>
                <div className={style.quickAccessGrid}>
                  {quickAccessData.map(renderQuickAccess)}
                </div>
              </div>

              {/* Команда проекта */}
              <div className={style.teamCard}>
                <div className={style.cardHeader}>
                  <div className={style.cardHeaderLeft}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <h3 className={style.cardTitle}>Команда проекта</h3>
                  </div>
                </div>
                <div className={style.teamList}>
                  {projectMembers.length === 0 ? (
                    <div className={style.noMembers}>
                      <p>Нет участников проекта</p>
                    </div>
                  ) : (
                    projectMembers.map((member) => (
                      <div key={member.id} className={style.teamMemberItem}>
                        <div className={style.memberAvatar}>
                          <div className={style.avatarInitial}>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div
                            className={`${style.statusIndicator} ${
                              style[member.status]
                            }`}
                          ></div>
                        </div>
                        <div className={style.memberInfo}>
                          <div className={style.memberName}>{member.name}</div>
                          <div className={style.memberRole}>{member.role}</div>
                        </div>
                        <div className={style.memberActivity}>
                          {member.status === "online"
                            ? "Активен"
                            : member.status === "away"
                              ? "Отошёл"
                              : "Не в сети"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className={style.tasksContent}>
              <Dashboard projectId={projectId} refreshKey={taskRefreshKey} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailPage;
