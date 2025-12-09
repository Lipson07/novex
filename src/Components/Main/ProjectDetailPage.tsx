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
} from "../../assets/MockData/index.js";
import Dashboard from "./Dashboard";
import style from "../../style/Main/ProjectDetailPage.module.scss";

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

interface TaskData {
  title: string;
  description: string;
  deadline: string;
  teamMembers: string[];
  gitBranch: string;
}

interface ProjectDetailPageProps {
  projectId: number;
  onBack?: () => void;
  onNavigateToTeamChat?: (projectId: number) => void;
  onNavigateToSchedule?: (projectId: number) => void;
  onNavigateToQuickNote?: (projectId: number) => void;
}

function ProjectDetailPage({
  projectId,
  onBack,
  onNavigateToTeamChat,
  onNavigateToSchedule,
  onNavigateToQuickNote,
}: ProjectDetailPageProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskData, setTaskData] = useState<TaskData>({
    title: "",
    description: "",
    deadline: "",
    teamMembers: [],
    gitBranch: "",
  });

  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [isAIDropdownOpen, setIsAIDropdownOpen] = useState(false);
  const aiDropdownRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "tasks">("overview");
  const [chatMessage, setChatMessage] = useState("");

  const teamMembersAvailable: string[] = [
    "Иван Иванов",
    "Петр Петров",
    "Анна Сидорова",
    "Михаил Кузнецов",
  ];

  const aiSuggestions = [
    "Обзор дорожной карты Q4",
    "Обновить документацию дизайн-системы",
    "Запланировать синхронизацию команды",
  ];


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

  const removeTeamMember = (memberToRemove: string) => {
    setTaskData({
      ...taskData,
      teamMembers: taskData.teamMembers.filter(
        (member) => member !== memberToRemove
      ),
    });
  };

  const handleTaskSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(
      "Создание задачи для проекта",
      projectId,
      "с mock данными:",
      taskData
    );
    // TODO: Здесь легко заменить на реальный fetch запрос к БД
    // Например: await ProjectService.createTask(projectId, taskData);
    setTaskData({
      title: "",
      description: "",
      deadline: "",
      teamMembers: [],
      gitBranch: "",
    });
    setIsTaskModalOpen(false);
  };
  const user = useSelector(selectUser);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      setError("");
      const projectData = await ProjectService.getProjectById(projectId, user?.id);
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

  const handleTeamChat = () => {
    onNavigateToTeamChat?.(projectId);
  };

  const handleSchedule = () => {
    onNavigateToSchedule?.(projectId);
  };

  const handleQuickNote = () => {
    onNavigateToQuickNote?.(projectId);
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
                <h1 className={style.projectTitle}>{project.tittle}</h1>
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
                <div className={style.metaItem}>
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
                  <div className={style.metaItem}>
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
              </div>

              <div className={style.actionButtons}>
                <button
                  className={style.actionButton}
                  onClick={handleCreateTask}
                  data-action="create-task"
                >
                  <img
                    src={taskIcon}
                    alt="Создать задачу"
                    width="20"
                    height="20"
                  />
                </button>

                <button
                  className={style.actionButton}
                  onClick={handleTeamChat}
                  data-action="team-chat"
                >
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
                >
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
                >
                  <img
                    src={noteIcon}
                    alt="Быстрая заметка"
                    width="20"
                    height="20"
                  />
                </button>

                {/* Кнопка AI */}
                <div className={style.aiButtonWrapper} ref={aiDropdownRef}>
                  <button
                    className={style.aiButton}
                    onClick={() => setIsAIDropdownOpen(!isAIDropdownOpen)}
                  >
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

                  {isAIDropdownOpen && (
                    <div className={style.aiDropdown}>
                      <div className={style.aiDropdownHeader}>
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
                        </div>
                      </div>

                      <div className={style.aiDropdownContent}>
                        <div className={style.suggestionsTitle}>
                          Умные предложения
                        </div>

                        <div className={style.suggestionsList}>
                          {aiSuggestions.map((suggestion, index) => (
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

                        <form
                          onSubmit={handleChatSubmit}
                          className={style.chatInputContainer}
                        >
                          <div className={style.chatInputWrapper}>
                            <input
                              type="text"
                              value={chatMessage}
                              onChange={(e) => setChatMessage(e.target.value)}
                              placeholder="Спросите AI..."
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
                  )}
                </div>
              </div>
            </div>
          </div>

          {project.description && (
            <div className={style.projectDescription}>
              <p>{project.description}</p>
            </div>
          )}

          {/* Статистика проекта */}
          <div className={style.projectStats}>
            {project.progress !== undefined && (
              <div className={style.statCard}>
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
              <div className={style.statCard}>
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
              <div className={style.statCard}>
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
                  <label htmlFor="task-deadline">Дедлайн</label>
                  <input
                    id="task-deadline"
                    type="text"
                    value={taskData.deadline || ""}
                    onChange={(e) =>
                      setTaskData({ ...taskData, deadline: e.target.value })
                    }
                    placeholder="Дедлайн (например: завтра, через 3 часа, 10.07)"
                  />
                </div>

                <div className={style.formGroup}>
                  <label>Члены команды</label>
                  <div className={style.teamMembersGroup}>
                    <button
                      type="button"
                      className={`${style.selectTeamButton} ${
                        showTeamDropdown ? style.open : ""
                      }`}
                      onClick={() => setShowTeamDropdown((prev) => !prev)}
                    >
                      <span>
                        {taskData.teamMembers.length === 0
                          ? "Выбрать участников"
                          : `Выбрано ${taskData.teamMembers.length} участник(ов)`}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={style.selectArrow}
                      >
                        <path d="m6 8 4 4 4-4" />
                      </svg>
                    </button>
                    {showTeamDropdown && (
                      <div className={style.teamDropdown}>
                        {teamMembersAvailable.map((member) => (
                          <label key={member} className={style.teamOption}>
                            <input
                              type="checkbox"
                              checked={taskData.teamMembers.includes(member)}
                              onChange={(e) => {
                                const newMembers = e.target.checked
                                  ? [...taskData.teamMembers, member]
                                  : taskData.teamMembers.filter(
                                      (m) => m !== member
                                    );
                                setTaskData({
                                  ...taskData,
                                  teamMembers: newMembers,
                                });
                              }}
                            />
                            <span>{member}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {taskData.teamMembers.length > 0 && (
                      <div className={style.chipsContainer}>
                        {taskData.teamMembers.map((member, index) => (
                          <div key={index} className={style.chip}>
                            {member}
                            <button
                              type="button"
                              className={style.chipRemove}
                              onClick={() => removeTeamMember(member)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className={style.formGroup}>
                  <label htmlFor="task-branch">Ветка Git</label>
                  <input
                    id="task-branch"
                    type="text"
                    value={taskData.gitBranch}
                    onChange={(e) =>
                      setTaskData({ ...taskData, gitBranch: e.target.value })
                    }
                    placeholder="Например: feature/new-task"
                    required
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
              {/* GitHub репозиторий */}
              <div className={style.githubCard}>
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
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    <h3 className={style.cardTitle}>GitHub репозиторий</h3>
                  </div>
                  <a
                    href="https://github.com/example/repo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={style.repoLink}
                  >
                    Открыть репозиторий
                  </a>
                </div>
                <div className={style.githubContent}>
                  <div className={style.branchesCompact}>
                    <h4 className={style.subsectionTitle}>Ветки</h4>
                    <div className={style.branchesListCompact}>
                      <div className={style.branchItemCompact}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M6 3v12a4 4 0 0 0 4 4 4 4 0 0 0 4-4V3" />
                        </svg>
                        <span className={style.branchNameCompact}>main</span>
                        <span className={style.branchCommitCompact}>a1b2c3d</span>
                      </div>
                      <div className={style.branchItemCompact}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M6 3v12a4 4 0 0 0 4 4 4 4 0 0 0 4-4V3" />
                        </svg>
                        <span className={style.branchNameCompact}>
                          feature/new-task
                        </span>
                        <span className={style.branchCommitCompact}>e4f5g6h</span>
                      </div>
                    </div>
                  </div>
                  <div className={style.commitsCompact}>
                    <h4 className={style.subsectionTitle}>Последние коммиты</h4>
                    <div className={style.commitsListCompact}>
                      <div className={style.commitItemCompact}>
                        <span className={style.commitHashCompact}>a1b2c3d</span>
                        <p className={style.commitMessageCompact}>
                          Добавлена авторизация через OAuth
                        </p>
                        <div className={style.commitMetaCompact}>
                          <span>Иван Иванов</span>
                          <span>•</span>
                          <span>2 часа назад</span>
                        </div>
                      </div>
                      <div className={style.commitItemCompact}>
                        <span className={style.commitHashCompact}>e4f5g6h</span>
                        <p className={style.commitMessageCompact}>
                          Исправлен баг с отображением карточек
                        </p>
                        <div className={style.commitMetaCompact}>
                          <span>Петр Петров</span>
                          <span>•</span>
                          <span>5 часов назад</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
                  <div className={style.activityItem}>
                    <div className={style.activityIcon}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div className={style.activityContent}>
                      <p>Создана задача "Реализовать авторизацию через OAuth"</p>
                      <span>2 часа назад</span>
                    </div>
                  </div>
                  <div className={style.activityItem}>
                    <div className={style.activityIcon}>
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
                    <div className={style.activityContent}>
                      <p>Добавлен новый участник: Анна Сидорова</p>
                      <span>5 часов назад</span>
                    </div>
                  </div>
                  <div className={style.activityItem}>
                    <div className={style.activityIcon}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                      </svg>
                    </div>
                    <div className={style.activityContent}>
                      <p>Обновлена документация проекта</p>
                      <span>1 день назад</span>
                    </div>
                  </div>
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
                  <div className={style.teamMemberItem}>
                    <div className={style.memberAvatar}>
                      <div className={style.avatarInitial}>ИИ</div>
                      <div className={`${style.statusIndicator} ${style.online}`}></div>
                    </div>
                    <div className={style.memberInfo}>
                      <div className={style.memberName}>Иван Иванов</div>
                      <div className={style.memberRole}>Разработчик</div>
                    </div>
                    <div className={style.memberActivity}>Активен</div>
                  </div>
                  <div className={style.teamMemberItem}>
                    <div className={style.memberAvatar}>
                      <div className={style.avatarInitial}>ПП</div>
                      <div className={`${style.statusIndicator} ${style.online}`}></div>
                    </div>
                    <div className={style.memberInfo}>
                      <div className={style.memberName}>Петр Петров</div>
                      <div className={style.memberRole}>Дизайнер</div>
                    </div>
                    <div className={style.memberActivity}>Активен</div>
                  </div>
                  <div className={style.teamMemberItem}>
                    <div className={style.memberAvatar}>
                      <div className={style.avatarInitial}>АС</div>
                      <div className={`${style.statusIndicator} ${style.away}`}></div>
                    </div>
                    <div className={style.memberInfo}>
                      <div className={style.memberName}>Анна Сидорова</div>
                      <div className={style.memberRole}>Тестировщик</div>
                    </div>
                    <div className={style.memberActivity}>Отошла</div>
                  </div>
                  <div className={style.teamMemberItem}>
                    <div className={style.memberAvatar}>
                      <div className={style.avatarInitial}>МК</div>
                      <div className={`${style.statusIndicator} ${style.offline}`}></div>
                    </div>
                    <div className={style.memberInfo}>
                      <div className={style.memberName}>Михаил Кузнецов</div>
                      <div className={style.memberRole}>Менеджер проекта</div>
                    </div>
                    <div className={style.memberActivity}>Не в сети</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className={style.tasksContent}>
              <Dashboard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailPage;
