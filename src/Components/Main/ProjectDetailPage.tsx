import React, { useState, useEffect } from "react";
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

interface ProjectDetailPageProps {
  projectId: number;
  onBack?: () => void;
}

function ProjectDetailPage({ projectId, onBack }: ProjectDetailPageProps) {
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
      const projectData = await ProjectService.getProjectById(projectId);
      setProject(projectData);
    } catch (error) {
      console.error("Ошибка загрузки проекта:", error);
      setError("Не удалось загрузить проект");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = () => {
    console.log("Создать задачу для проекта:", projectId);
    // Здесь будет логика создания задачи
  };

  const handleTeamChat = () => {
    console.log("Открыть командный чат проекта:", projectId);
    // Здесь будет логика открытия чата
  };

  const handleSchedule = () => {
    console.log("Открыть расписание проекта:", projectId);
    // Здесь будет логика открытия расписания
  };

  const handleQuickNote = () => {
    console.log("Создать быструю заметку для проекта:", projectId);
    // Здесь будет логика создания заметки
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
        {/* Кнопка назад */}
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
            <span>Назад к проектам</span>
          </button>
        )}

        {/* Заголовок и информация о проекте */}
        <div className={style.projectHeader}>
          <div className={style.headerTop}>
            <div className={style.projectTitleSection}>
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

        {/* Кнопки действий */}
        <div className={style.actionButtons}>
          <button
            className={style.actionButton}
            onClick={handleCreateTask}
            data-action="create-task"
          >
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
            <span>Создать задачу</span>
          </button>

          <button
            className={style.actionButton}
            onClick={handleTeamChat}
            data-action="team-chat"
          >
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
              <path d="M8.55664 17.5C8.70293 17.7533 8.91332 17.9637 9.16668 18.11C9.42003 18.2563 9.70743 18.3333 9.99997 18.3333C10.2925 18.3333 10.5799 18.2563 10.8333 18.11C11.0866 17.9637 11.297 17.7533 11.4433 17.5" />
              <path d="M2.71833 12.7717C2.60947 12.8911 2.53763 13.0394 2.51155 13.1988C2.48547 13.3582 2.50627 13.5218 2.57142 13.6696C2.63658 13.8174 2.74328 13.943 2.87855 14.0313C3.01381 14.1196 3.17182 14.1666 3.33333 14.1667H16.6667C16.8282 14.1668 16.9862 14.1199 17.1216 14.0318C17.2569 13.9437 17.3637 13.8182 17.4291 13.6705C17.4944 13.5228 17.5154 13.3593 17.4895 13.1999C17.4637 13.0405 17.392 12.892 17.2833 12.7726C16.175 11.6301 15 10.4159 15 6.66675C15 5.34067 14.4732 4.0689 13.5355 3.13121C12.5979 2.19353 11.3261 1.66675 10 1.66675C8.67392 1.66675 7.40215 2.19353 6.46447 3.13121C5.52679 4.0689 5 5.34067 5 6.66675C5 10.4159 3.82417 11.6301 2.71833 12.7717Z" />
            </svg>
            <span>Командный чат</span>
          </button>

          <button
            className={style.actionButton}
            onClick={handleSchedule}
            data-action="schedule"
          >
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
              <path d="M3.33329 16.6667H16.6666C17.1087 16.6667 17.5326 16.4911 17.8451 16.1785C18.1577 15.866 18.3333 15.442 18.3333 15V6.66667C18.3333 6.22464 18.1577 5.80072 17.8451 5.48816C17.5326 5.17559 17.1087 5 16.6666 5H10.0583C9.78378 4.99858 9.51387 4.92937 9.27254 4.79853C9.03121 4.66769 8.82594 4.47927 8.67496 4.25L7.99163 3.25C7.84065 3.02073 7.63537 2.83231 7.39404 2.70147C7.15272 2.57063 6.8828 2.50142 6.60829 2.5H3.33329C2.89127 2.5 2.46734 2.67559 2.15478 2.98816C1.84222 3.30072 1.66663 3.72464 1.66663 4.16667V15C1.66663 15.9167 2.41663 16.6667 3.33329 16.6667Z" />
              <path d="M6.66663 8.33325V11.6666" />
              <path d="M10 8.33325V9.99992" />
              <path d="M13.3334 8.33325V13.3333" />
            </svg>
            <span>Расписание</span>
          </button>

          <button
            className={style.actionButton}
            onClick={handleQuickNote}
            data-action="quick-note"
          >
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
              <path d="M12.5 17.5V10.8333C12.5 10.6123 12.4122 10.4004 12.2559 10.2441C12.0996 10.0878 11.8877 10 11.6667 10H8.33333C8.11232 10 7.90036 10.0878 7.74408 10.2441C7.5878 10.4004 7.5 10.6123 7.5 10.8333V17.5" />
              <path d="M2.5 8.33333C2.49994 8.09088 2.55278 7.85135 2.65482 7.63142C2.75687 7.4115 2.90566 7.21649 3.09083 7.05999L8.92417 2.05999C9.22499 1.80575 9.60613 1.66626 10 1.66626C10.3939 1.66626 10.775 1.80575 11.0758 2.05999L16.9092 7.05999C17.0943 7.21649 17.2431 7.4115 17.3452 7.63142C17.4472 7.85135 17.5001 8.09088 17.5 8.33333V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V8.33333Z" />
            </svg>
            <span>Быстрая заметка</span>
          </button>
        </div>

        {/* Dashboard */}
        <div className={style.dashboardSection}>
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailPage;
