import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user";
import style from "../../style/Common/Notifications.module.scss";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface Notification {
  id: number;
  type: "commit" | "project" | "task" | "task_completed" | "comment" | "question" | "member_added";
  title: string;
  message: string;
  project_id?: number;
  project_title?: string;
  created_at: string;
  read: boolean;
}

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ isOpen, onClose }) => {
  const user = useSelector(selectUser);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Загрузка уведомлений
  useEffect(() => {
    if (isOpen && user?.id) {
      fetchNotifications();
    }
  }, [isOpen, user?.id]);

  const fetchNotifications = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      // Получаем последнюю активность проектов
      const activityResponse = await fetch(
        `${API_BASE_URL}/projects/activity/recent?user_id=${user.id}&limit=20`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const activityData = await activityResponse.json();

      if (activityResponse.ok && activityData.success) {
        // Преобразуем активность в уведомления
        const formattedNotifications: Notification[] = (
          activityData.activities || []
        ).map((activity: any, index: number) => {
          let type: Notification["type"] = "task";
          let title = "Новое событие";
          let message = activity.message || "Произошло новое событие";

          // Определяем тип уведомления по типу активности
          if (activity.type === "task_created") {
            type = "task";
            title = "Новая задача";
            message = activity.message || "Создана новая задача";
          } else if (activity.type === "task_completed") {
            type = "task_completed";
            title = "Задача завершена";
            message = activity.message || "Задача была завершена";
          } else if (activity.type === "project_created") {
            type = "project";
            title = "Новый проект";
            message = activity.message || "Создан новый проект";
          } else if (activity.type === "member_added") {
            type = "member_added";
            title = "Новый участник";
            message = activity.message || "Добавлен новый участник";
          } else if (activity.type === "comment_added") {
            type = "comment";
            title = "Новый комментарий";
            message = activity.message || "Добавлен новый комментарий";
          } else if (activity.type === "question_asked") {
            type = "question";
            title = "Новый вопрос";
            message = activity.message || "Задан новый вопрос";
          } else if (activity.type === "commit_pushed") {
            type = "commit";
            title = "Новый коммит";
            message = activity.message || "Выполнен новый коммит";
          }

          return {
            id: activity.id || index,
            type,
            title,
            message,
            project_id: activity.project_id,
            project_title: activity.project_title,
            created_at: activity.created_at || activity.createdAt || new Date().toISOString(),
            read: false,
          };
        });

        setNotifications(formattedNotifications);
      }
    } catch (error) {
      console.error("Ошибка загрузки уведомлений:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "commit":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "project":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 22V12H15V22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "task":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
        );
      case "comment":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "question":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M9.09 9A3 3 0 0 1 12 6C13.5 6 15 7.5 15 9C15 10.5 13.5 12 12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="12"
              y1="16"
              x2="12"
              y2="16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case "member_added":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "commit":
        return "#667EEA";
      case "project":
        return "#05DF72";
      case "task":
        return "#FDC700";
      case "task_completed":
        return "#05DF72";
      case "comment":
        return "#FF8C42";
      case "question":
        return "#FF4D4D";
      case "member_added":
        return "#667EEA";
      default:
        return "#667EEA";
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

  if (!isOpen) return null;

  return (
    <div className={style.notificationsOverlay}>
      <div className={style.notificationsPanel} ref={notificationsRef}>
        <div className={style.notificationsHeader}>
          <h3 className={style.notificationsTitle}>Уведомления</h3>
          <button className={style.closeButton} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={style.notificationsContent}>
          {isLoading ? (
            <div className={style.loading}>
              <div className={style.spinner}></div>
              <p>Загрузка уведомлений...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className={style.notificationsList}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${style.notificationItem} ${
                    !notification.read ? style.notificationItemUnread : ""
                  }`}
                >
                  <div
                    className={style.notificationIcon}
                    style={{ color: getNotificationColor(notification.type) }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className={style.notificationContent}>
                    <div className={style.notificationHeader}>
                      <h4 className={style.notificationTitle}>
                        {notification.title}
                      </h4>
                      <span className={style.notificationTime}>
                        {formatTimeAgo(notification.created_at)}
                      </span>
                    </div>
                    <p className={style.notificationMessage}>
                      {notification.message}
                    </p>
                    {notification.project_title && (
                      <span className={style.notificationProject}>
                        {notification.project_title}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={style.emptyState}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  stroke="var(--color-primary-soft)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M18 18L46 46M46 18L18 46"
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p>Нет новых уведомлений</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;


